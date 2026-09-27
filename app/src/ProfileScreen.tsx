import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { FollowButton } from "./design-system/FollowButton";
import { CaretLeft, GridFour } from "./design-system/PrototypeIcons";
import { INFORMATION_COPY } from "./ArtworkInformationSection";
import { MobileScroll } from "./mobile/MobileScroll";
import { getSearchAccounts } from "./SearchEntities";
import { SaverAvatar } from "./TodaySaversSheet";
import { DEFAULT_BOARD_ID, type SavedBoard } from "./today-boards";
import { useCurrentReader, useFollowedPeople, type SavedPerson } from "./today-savers";
import "./profile-screen.css";

type Locale = "en" | "pt-BR" | "it" | "es";
type Section = "artworks" | "folders" | "following" | "followers";

export type ProfileArtwork<Id extends string = string> = {
  id: Id;
  title: string;
  creator: string;
  year: string;
  image: string;
  imagePosition?: string;
};

export type ProfileScreenProps<Id extends string = string> = {
  locale: Locale;
  person?: SavedPerson;
  idPrefix?: string;
  artworks: readonly ProfileArtwork<Id>[];
  savedIds: readonly Id[];
  folders: readonly SavedBoard<Id>[];
  followers?: readonly SavedPerson[];
  followingPeople?: readonly SavedPerson[];
  onShareProfile?: () => void;
  sharingProfile?: boolean;
  shareLabel?: string;
  onOpenProfile?: (id: string) => void;
  onBack: () => void;
  onOpenArtwork: (id: Id) => void;
};

const COPY = {
  en: {
    profile: "Profile", back: "Back to settings", backToFolders: "Back to folders",
    backToPrevious: "Back", viewProfile: "View profile", sampleProfile: "Sample profile",
    noSharedArtworks: "No artworks shared yet.", noSharedFolders: "No folders shared yet.", noSharedFollowing: "No accounts to show yet.",
    artworks: "Artworks", folders: "Folders", following: "Following", followers: "Followers",
    sample: "Sample profiles",
    myFolder: "My folder", noArtworks: "No saved artworks yet.", noFolders: "No folders yet.",
    noFolderArtworks: "No saved artworks in this folder yet.", noFollowing: "You aren't following anyone yet.",
    noFollowers: "No followers yet.", openArtwork: (title: string) => `Open ${title}`,
    folderSaves: (count: number) => `${count} ${count === 1 ? "save" : "saves"}`,
  },
  "pt-BR": {
    profile: "Perfil", back: "Voltar aos ajustes", backToFolders: "Voltar às pastas",
    backToPrevious: "Voltar", viewProfile: "Ver perfil", sampleProfile: "Perfil de exemplo",
    noSharedArtworks: "Nenhuma obra compartilhada ainda.", noSharedFolders: "Nenhuma pasta compartilhada ainda.", noSharedFollowing: "Nenhuma conta para mostrar ainda.",
    artworks: "Obras", folders: "Pastas", following: "Seguindo", followers: "Seguidores",
    sample: "Perfis de exemplo",
    myFolder: "Minha pasta", noArtworks: "Nenhuma obra salva ainda.", noFolders: "Nenhuma pasta ainda.",
    noFolderArtworks: "Nenhuma obra salva nesta pasta ainda.", noFollowing: "Você ainda não segue ninguém.",
    noFollowers: "Nenhum seguidor ainda.", openArtwork: (title: string) => `Abrir ${title}`,
    folderSaves: (count: number) => `${count} ${count === 1 ? "obra salva" : "obras salvas"}`,
  },
  it: {
    profile: "Profilo", back: "Torna alle impostazioni", backToFolders: "Torna alle cartelle",
    backToPrevious: "Indietro", viewProfile: "Vedi profilo", sampleProfile: "Profilo di esempio",
    noSharedArtworks: "Nessuna opera condivisa.", noSharedFolders: "Nessuna cartella condivisa.", noSharedFollowing: "Nessun account da mostrare.",
    artworks: "Opere", folders: "Cartelle", following: "Seguiti", followers: "Follower",
    sample: "Profili di esempio",
    myFolder: "La mia cartella", noArtworks: "Nessuna opera salvata.", noFolders: "Nessuna cartella.",
    noFolderArtworks: "Nessuna opera salvata in questa cartella.", noFollowing: "Non segui ancora nessuno.",
    noFollowers: "Ancora nessun follower.", openArtwork: (title: string) => `Apri ${title}`,
    folderSaves: (count: number) => `${count} ${count === 1 ? "opera salvata" : "opere salvate"}`,
  },
  es: {
    profile: "Perfil", back: "Volver a ajustes", backToFolders: "Volver a carpetas",
    backToPrevious: "Volver", viewProfile: "Ver perfil", sampleProfile: "Perfil de ejemplo",
    noSharedArtworks: "Aún no hay obras compartidas.", noSharedFolders: "Aún no hay carpetas compartidas.", noSharedFollowing: "Aún no hay cuentas para mostrar.",
    artworks: "Obras", folders: "Carpetas", following: "Siguiendo", followers: "Seguidores",
    sample: "Perfiles de ejemplo",
    myFolder: "Mi carpeta", noArtworks: "Aún no hay obras guardadas.", noFolders: "Aún no hay carpetas.",
    noFolderArtworks: "Aún no hay obras guardadas en esta carpeta.", noFollowing: "Aún no sigues a nadie.",
    noFollowers: "Aún no tienes seguidores.", openArtwork: (title: string) => `Abrir ${title}`,
    folderSaves: (count: number) => `${count} ${count === 1 ? "obra guardada" : "obras guardadas"}`,
  },
} as const;

const SECTIONS: readonly Section[] = ["artworks", "folders", "following", "followers"];
/** Profile data is supplied separately from the current reader's follow actions. */
export function ProfileScreen<Id extends string>({
  locale, person: suppliedPerson, idPrefix = "taste-profile", artworks, savedIds, folders, followers = [],
  followingPeople: suppliedFollowing = [], onShareProfile, sharingProfile = false, shareLabel,
  onOpenProfile, onBack, onOpenArtwork,
}: ProfileScreenProps<Id>) {
  const currentPerson = useCurrentReader();
  const person = suppliedPerson ?? currentPerson;
  const copy = COPY[locale];
  const followLabels = INFORMATION_COPY[locale];
  const [section, setSection] = useState<Section>("artworks");
  const [folderId, setFolderId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLElement | null>(null);
  const previousSection = useRef(section);
  const statRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const folderBackRef = useRef<HTMLButtonElement | null>(null);
  const folderCardRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingFolderFocus = useRef<"back" | string | null>(null);
  const { followed, toggleFollow } = useFollowedPeople();
  const isOwnProfile = person.id === currentPerson.id;
  const followsProfile = followed.has(person.id);
  const allAccounts = useMemo(() => getSearchAccounts(""), []);
  const actionablePersonIds = useMemo(() => new Set(allAccounts.map(person => person.id)), [allAccounts]);
  const followingPeople = isOwnProfile ? allAccounts.filter(person => followed.has(person.id)) : suppliedFollowing;
  // The local prototype knows only the current reader's edge to this sample person.
  const profileFollowers = !isOwnProfile && followsProfile && !followers.some(item => item.id === currentPerson.id)
    ? [...followers, currentPerson] : followers;
  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);
  const savedArtworks = artworks.filter(artwork => savedSet.has(artwork.id));
  const artworkById = useMemo(() => new Map(artworks.map(artwork => [artwork.id, artwork])), [artworks]);
  const activeFolder = folderId ? folders.find(folder => folder.id === folderId) : undefined;
  const folderArtworks = activeFolder?.pieceIds
    .filter(id => savedSet.has(id))
    .map(id => artworkById.get(id))
    .filter((artwork): artwork is ProfileArtwork<Id> => Boolean(artwork)) ?? [];
  const counts = {
    artworks: savedArtworks.length,
    folders: folders.length,
    following: followingPeople.length,
    followers: profileFollowers.length,
  };
  const number = new Intl.NumberFormat(locale);

  useLayoutEffect(() => {
    if (previousSection.current === section) return;
    previousSection.current = section;
    if (reducedMotion) return;
    // Keep the panel and focus stable; rapid switches cancel the previous fade.
    const animation = panelRef.current?.animate(
      [{ opacity: .6 }, { opacity: 1 }],
      { duration: 180, easing: "ease-out" },
    );
    return () => animation?.cancel();
  }, [section, reducedMotion]);

  useLayoutEffect(() => {
    const target = pendingFolderFocus.current;
    if (!target) return;
    pendingFolderFocus.current = null;
    if (target === "back") folderBackRef.current?.focus({ preventScroll: true });
    else folderCardRefs.current.get(target)?.focus({ preventScroll: true });
  }, [folderId]);

  function openFolder(id: string) {
    pendingFolderFocus.current = "back";
    setFolderId(id);
  }

  function closeFolder() {
    const previous = folderId;
    pendingFolderFocus.current = previous;
    setFolderId(null);
  }

  function selectSection(next: Section) {
    setSection(next);
  }

  function onStatKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % SECTIONS.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + SECTIONS.length - 1) % SECTIONS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = SECTIONS.length - 1;
    else return;
    event.preventDefault();
    selectSection(SECTIONS[nextIndex]);
    statRefs.current[nextIndex]?.focus();
  }

  function handleFollow(person: SavedPerson) {
    const removing = followed.has(person.id);
    toggleFollow(person.id);
    // Unfollowing removes this row from Following, so keep keyboard focus in the tablist.
    if (removing && section === "following") window.requestAnimationFrame(() => statRefs.current[2]?.focus());
  }

  function artworkList(items: readonly ProfileArtwork<Id>[], empty: string) {
    if (!items.length) return <p className="taste-profile-empty">{empty}</p>;
    return <ul className="taste-profile-artwork-list">
      {items.map(artwork => <li key={artwork.id}>
        <button className="taste-profile-artwork" type="button" onClick={() => onOpenArtwork(artwork.id)} aria-label={copy.openArtwork(artwork.title)}>
          <img src={artwork.image} style={{ objectPosition: artwork.imagePosition }} alt="" loading="lazy" draggable={false} />
          <span className="taste-profile-artwork-copy">
            <strong>{artwork.title}</strong>
            <span>{artwork.creator}</span>
          </span>
        </button>
      </li>)}
    </ul>;
  }

  function peopleList(people: readonly SavedPerson[], empty: string, sample: boolean) {
    if (!people.length) return <p className="taste-profile-empty">{empty}</p>;
    return <>
      {sample && <p className="taste-profile-sample-note">{copy.sample}</p>}
      <ul className="taste-profile-people-list">
        {people.map(person => {
          const isFollowing = followed.has(person.id);
          return <li className="taste-profile-person" key={person.id}>
            {onOpenProfile && !person.isCurrentUser ? <button className="taste-profile-person-open" type="button" aria-label={`${copy.viewProfile}: ${person.name}`} onClick={() => onOpenProfile(person.id)}>
              <SaverAvatar person={person} />
              <span className="taste-profile-person-name"><strong>{person.name}</strong>{person.handle && <small>@{person.handle}</small>}</span>
            </button> : <>
              <SaverAvatar person={person} />
              <span className="taste-profile-person-name"><strong>{person.name}</strong>{person.handle && <small>@{person.handle}</small>}</span>
            </>}
            {!person.isCurrentUser && actionablePersonIds.has(person.id) && <FollowButton
              following={isFollowing}
              followLabel={followLabels.follow}
              followingLabel={followLabels.following}
              ariaLabel={isFollowing ? `${followLabels.following} ${person.name}. ${followLabels.unfollow}` : `${followLabels.follow} ${person.name}`}
              onClick={() => handleFollow(person)}
            />}
          </li>;
        })}
      </ul>
    </>;
  }

  return <MobileScroll className="app-scroll taste-profile-scroll">
    <main className="taste-profile-screen" aria-label={copy.profile} data-profile-owner={isOwnProfile}>
      <header className="taste-profile-hero">
        <nav className="taste-profile-nav" aria-label={copy.profile}>
          <button type="button" onClick={onBack} aria-label={isOwnProfile ? copy.back : copy.backToPrevious}><CaretLeft size={20} /></button>
          {!isOwnProfile && person.id.startsWith("sample-person-") && <span className="taste-profile-context">{copy.sampleProfile}</span>}
        </nav>
        <SaverAvatar person={person} />
        <h1>{person.name}</h1>
        {person.handle && <p className="taste-profile-handle">@{person.handle}</p>}
        <div className="taste-profile-actions">
          {isOwnProfile ? onShareProfile && <button type="button" className="dc-follow-button taste-profile-share" onClick={onShareProfile} disabled={sharingProfile} aria-busy={sharingProfile}>{shareLabel}</button> : <FollowButton
            following={followsProfile}
            followLabel={followLabels.follow}
            followingLabel={followLabels.following}
            ariaLabel={followsProfile ? `${followLabels.following} ${person.name}. ${followLabels.unfollow}` : `${followLabels.follow} ${person.name}`}
            onClick={() => toggleFollow(person.id)}
          />}
        </div>
      </header>

      <div className="taste-profile-stats" role="tablist" aria-label={copy.profile}>
        <span className="taste-profile-tab-indicator" aria-hidden="true" style={{ transform: `translateX(${SECTIONS.indexOf(section) * 100}%)` }} />
        {SECTIONS.map((item, index) => <button
          key={item}
          ref={element => { statRefs.current[index] = element; }}
          type="button"
          id={`${idPrefix}-tab-${item}`}
          role="tab"
          aria-selected={section === item}
          aria-controls={`${idPrefix}-panel`}
          tabIndex={section === item ? 0 : -1}
          onClick={() => selectSection(item)}
          onKeyDown={event => onStatKeyDown(event, index)}
        >
          <strong>{number.format(counts[item])}</strong>
          <span>{copy[item]}</span>
        </button>)}
      </div>

      <section ref={panelRef} id={`${idPrefix}-panel`} className="taste-profile-content" role="tabpanel" aria-labelledby={`${idPrefix}-tab-${section}`} tabIndex={0}>
        {section === "artworks" && artworkList(savedArtworks, isOwnProfile ? copy.noArtworks : copy.noSharedArtworks)}
        {section === "folders" && <>
          {activeFolder ? <>
            <button ref={folderBackRef} type="button" className="taste-profile-folder-back" onClick={closeFolder}>
              <CaretLeft size={14} /><span>{copy.backToFolders}</span>
            </button>
            <h2 className="taste-profile-folder-title">{activeFolder.id === DEFAULT_BOARD_ID ? copy.myFolder : activeFolder.name}</h2>
            {artworkList(folderArtworks, copy.noFolderArtworks)}
          </> : <>
            {folders.length ? <div className="taste-profile-folder-grid" aria-label={copy.folders}>
              {folders.map(folder => {
                const memberIds = folder.pieceIds.filter(id => savedSet.has(id));
                const cover = (folder.coverPieceId ? artworkById.get(folder.coverPieceId) : undefined)
                  ?? memberIds.map(id => artworkById.get(id)).find(Boolean);
                const name = folder.id === DEFAULT_BOARD_ID ? copy.myFolder : folder.name;
                return <button
                  key={folder.id}
                  ref={element => { if (element) folderCardRefs.current.set(folder.id, element); else folderCardRefs.current.delete(folder.id); }}
                  type="button"
                  className="taste-profile-folder"
                  onClick={() => openFolder(folder.id)}
                >
                  <span className="taste-profile-folder-cover">
                    {cover ? <img src={cover.image} style={{ objectPosition: cover.imagePosition }} alt="" loading="lazy" draggable={false} /> : <GridFour size={24} />}
                  </span>
                  <span className="taste-profile-folder-name">{name}</span>
                  <span className="taste-profile-folder-count">{copy.folderSaves(memberIds.length)}</span>
                </button>;
              })}
            </div> : <p className="taste-profile-empty">{isOwnProfile ? copy.noFolders : copy.noSharedFolders}</p>}
          </>}
        </>}
        {section === "following" && peopleList(followingPeople, isOwnProfile ? copy.noFollowing : copy.noSharedFollowing, true)}
        {section === "followers" && peopleList(profileFollowers, copy.noFollowers, false)}
      </section>
    </main>
  </MobileScroll>;
}
