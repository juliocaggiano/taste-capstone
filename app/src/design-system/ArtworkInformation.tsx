import { useId } from 'react'
import { FollowButton } from './FollowButton'
import './artwork-information.css'

export type TechnicalInformationProps = {
  title: string
  items: { label: string; value: string }[]
}

export function TechnicalInformation({ title, items }: TechnicalInformationProps) {
  const headingId = useId()

  if (items.length === 0) return null

  return (
    <section className="dc-work-information" aria-labelledby={headingId}>
      <div className="dc-work-information-heading">
        <h2 id={headingId}>{title}</h2>
      </div>
      <dl className="dc-work-information-fields">
        {items.map(({ label, value }, index) => (
          <div className="dc-work-information-field" key={`${label}-${index}`}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export type CreatorBiographyProps = {
  name: string
  details: string
  biography: string
  image: string
  imagePosition?: string
  followLabel: string
  followingLabel: string
  followAriaLabel: string
  following: boolean
  onFollow?: () => void
  onOpenCreator?: () => void
  openCreatorLabel?: string
}

export function CreatorBiography({
  name,
  details,
  biography,
  image,
  imagePosition,
  followLabel,
  followingLabel,
  followAriaLabel,
  following,
  onFollow,
  onOpenCreator,
  openCreatorLabel,
}: CreatorBiographyProps) {
  const headingId = useId()

  return (
    <section className="dc-creator-biography" aria-labelledby={headingId}>
      <div className="dc-creator-biography-header">
        <div className="dc-creator-biography-identity">
          <img
            className="dc-creator-biography-avatar"
            src={image}
            alt=""
            width={36}
            height={36}
            style={{ objectPosition: imagePosition }}
            loading="lazy"
            draggable={false}
          />
          <div className="dc-creator-biography-details">
            <h2 id={headingId}>
              {onOpenCreator ? (
                <button
                  className="dc-creator-biography-open"
                  type="button"
                  onClick={onOpenCreator}
                  aria-label={openCreatorLabel}
                >
                  {name}
                </button>
              ) : name}
            </h2>
            {details && <p>{details}</p>}
          </div>
        </div>
        {onFollow && (
          <FollowButton following={following} followLabel={followLabel} followingLabel={followingLabel}
            ariaLabel={followAriaLabel} onClick={onFollow} />
        )}
      </div>
      {biography && <p className="dc-creator-biography-copy">{biography}</p>}
    </section>
  )
}
