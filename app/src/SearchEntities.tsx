import { INFORMATION_COPY, useArtworkInformation } from "./ArtworkInformationSection";
import { FollowButton } from "./design-system/FollowButton";
import { SaverAvatar } from "./TodaySaversSheet";
import { getSampleSavers, useFollowedPeople, type SavedPerson } from "./today-savers";
import "./search-entities.css";

type Locale = "en" | "pt-BR" | "it" | "es";

const COPY = {
  en: { openArtist: "View artist", openProfile: "View profile", artwork: "artwork", artworks: "artworks" },
  "pt-BR": { openArtist: "Ver artista", openProfile: "Ver perfil", artwork: "obra", artworks: "obras" },
  it: { openArtist: "Vedi artista", openProfile: "Vedi profilo", artwork: "opera", artworks: "opere" },
  es: { openArtist: "Ver artista", openProfile: "Ver perfil", artwork: "obra", artworks: "obras" },
} as const;

export function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/\s+/g, " ");
}

/** These are the same local sample accounts used by the saved-by sheet. */
export function getSearchAccounts(query: string): SavedPerson[] {
  const terms = normalizeSearch(query).split(" ").filter(Boolean);
  return getSampleSavers(65, false).filter(person => {
    const identity = normalizeSearch(`${person.name} @${person.handle}`);
    return terms.every(term => identity.includes(term));
  });
}

export type SearchArtist = {
  id: string;
  name: string;
  image: string;
  imagePosition?: string;
  details: string;
  worksCount: number;
};

export function SearchArtistResults({ artists, locale, onOpenArtist }: {
  artists: readonly SearchArtist[];
  locale: Locale;
  onOpenArtist: (id: string) => void;
}) {
  const { followedCreators, toggleFollow } = useArtworkInformation();
  const labels = INFORMATION_COPY[locale];
  const copy = COPY[locale];

  return <ul className="search-entity-results search-artist-results">
    {artists.map(artist => {
      const saved = followedCreators.has(artist.id);
      const countLabel = `${new Intl.NumberFormat(locale).format(artist.worksCount)} ${artist.worksCount === 1 ? copy.artwork : copy.artworks}`;
      return <li className="search-entity-row search-artist-row" key={artist.id} data-artist-id={artist.id}>
        <button className="search-artist-open" type="button" aria-label={`${copy.openArtist}: ${artist.name}`} onClick={() => onOpenArtist(artist.id)}>
          <img className="search-artist-avatar" src={artist.image} style={{ objectPosition: artist.imagePosition }} alt="" draggable={false} loading="lazy" />
          <span className="search-entity-identity">
            <span className="search-entity-name">{artist.name}</span>
            <span className="search-entity-details">{artist.details ? `${artist.details} · ` : ""}{countLabel}</span>
          </span>
        </button>
        {!artist.id.startsWith("unknown-") && <FollowButton
          following={saved}
          followLabel={labels.save}
          followingLabel={labels.saved}
          ariaLabel={saved ? `${labels.saved} ${artist.name}. ${labels.unsave}` : `${labels.save} ${artist.name}`}
          onClick={() => toggleFollow(artist.id)}
        />}
      </li>;
    })}
  </ul>;
}

export function SearchAccountResults({ people, locale, onOpenProfile }: {
  people: readonly SavedPerson[];
  locale: Locale;
  onOpenProfile: (personId: string) => void;
}) {
  const { followed, toggleFollow } = useFollowedPeople();
  const labels = INFORMATION_COPY[locale];
  const copy = COPY[locale];

  return <div className="search-account-results">
    <ul className="search-entity-results">
      {people.map(person => {
        const following = followed.has(person.id);
        return <li className="search-entity-row search-account-row" key={person.id} data-person-id={person.id}>
          <button className="search-account-open" type="button" aria-label={`${copy.openProfile}: ${person.name}`} onClick={() => onOpenProfile(person.id)}>
            <SaverAvatar person={person} />
            <span className="search-entity-identity">
              <span className="search-entity-name">{person.name}</span>
              <span className="search-entity-details">@{person.handle}</span>
            </span>
          </button>
          {!person.isCurrentUser && <FollowButton
            following={following}
            followLabel={labels.follow}
            followingLabel={labels.following}
            ariaLabel={following ? `${labels.following} ${person.name}. ${labels.unfollow}` : `${labels.follow} ${person.name}`}
            onClick={() => toggleFollow(person.id)}
          />}
        </li>;
      })}
    </ul>
  </div>;
}
