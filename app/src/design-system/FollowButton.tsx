import { motion, useReducedMotion } from 'motion/react'
import './follow-button.css'

export type FollowButtonProps = {
  following: boolean
  followLabel: string
  followingLabel: string
  ariaLabel: string
  onClick: () => void
  disabled?: boolean
}

/** Native click handling preserves the phone runtime's suppression of clicks after drags. */
export function FollowButton({ following, followLabel, followingLabel, ariaLabel, onClick, disabled = false }: FollowButtonProps) {
  const reducedMotion = useReducedMotion()
  const transition = { duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <button
      className="dc-follow-button"
      type="button"
      aria-label={ariaLabel}
      aria-pressed={following}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Both labels reserve space, keeping the pill and adjacent creator name stationary. */}
      <span className="dc-follow-labels" aria-hidden="true">
        <motion.span className="dc-follow-label" initial={false}
          animate={{ opacity: following ? 0 : 1, y: reducedMotion ? 0 : following ? -5 : 0 }}
          transition={transition}>
          {followLabel}
        </motion.span>
        <motion.span className="dc-follow-label" initial={false}
          animate={{ opacity: following ? 1 : 0, y: reducedMotion ? 0 : following ? 0 : 5 }}
          transition={transition}>
          <svg className="dc-follow-check" width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <motion.path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              initial={false} animate={{ pathLength: following ? 1 : 0 }}
              transition={{ duration: reducedMotion ? 0 : following ? 0.3 : 0.16, ease: 'easeOut' }} />
          </svg>
          {followingLabel}
        </motion.span>
      </span>
    </button>
  )
}
