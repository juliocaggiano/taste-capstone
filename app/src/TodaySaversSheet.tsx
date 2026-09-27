import { useState } from "react";
import { BottomSheet } from "./mobile";
import { FollowButton } from "./design-system/FollowButton";
import { INFORMATION_COPY } from "./ArtworkInformationSection";
import { useFollowedPeople, type SavedPerson } from "./today-savers";
import "./today-savers.css";

const COPY = {
  en: { sample: "Sample profiles", you: "You", empty: "Be the first to save this artwork." },
  "pt-BR": { sample: "Perfis de exemplo", you: "Você", empty: "Seja a primeira pessoa a salvar esta obra." },
  it: { sample: "Profili di esempio", you: "Tu", empty: "Salva quest’opera per primo." },
  es: { sample: "Perfiles de ejemplo", you: "Tú", empty: "Sé la primera persona en guardar esta obra." },
} as const;

export function SaverAvatar({ person }: { person: SavedPerson }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const avatarUrl = person.avatarUrl?.trim();
  return <span className="today-saver-avatar" data-tone={person.tone} aria-hidden="true">
    {avatarUrl && failedImage !== avatarUrl
      ? <img src={avatarUrl} alt="" draggable={false} onError={() => setFailedImage(avatarUrl)} />
      : person.initials}
  </span>;
}

export function TodaySaversSheet({ open, onOpenChange, title, locale, people }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  locale: string;
  people: readonly SavedPerson[];
}) {
  const language = locale in COPY ? locale as keyof typeof COPY : "en";
  const copy = COPY[language];
  const labels = INFORMATION_COPY[language];
  const { followed, toggleFollow } = useFollowedPeople();

  return <BottomSheet open={open} onOpenChange={onOpenChange} title={title} description={copy.sample} snap={.82}>
    <div className="today-savers-sheet">
      {people.length ? <ul className="today-savers-list">
        {people.map(person => {
          const following = followed.has(person.id);
          return <li className="today-saver-row" key={person.id} data-person-id={person.id}>
            <SaverAvatar person={person} />
            <div className="today-saver-identity">
              <span className="today-saver-name">{person.isCurrentUser ? copy.you : person.name}</span>
              {!person.isCurrentUser && <span className="today-saver-handle">@{person.handle}</span>}
            </div>
            {!person.isCurrentUser && <FollowButton
              following={following}
              followLabel={labels.follow}
              followingLabel={labels.following}
              ariaLabel={following ? `${labels.following} ${person.name}. ${labels.unfollow}` : `${labels.follow} ${person.name}`}
              onClick={() => toggleFollow(person.id)}
            />}
          </li>;
        })}
      </ul> : <p className="today-savers-empty">{copy.empty}</p>}
    </div>
  </BottomSheet>;
}
