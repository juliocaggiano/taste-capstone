import { useEffect, useRef } from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'
import { PrototypeIconGlyph } from './PrototypeIcons'

export type NavigationIconName = 'daily' | 'search' | 'create' | 'favourites' | 'settings'

export type NavigationIconProps = {
  name: NavigationIconName
  active: boolean
}

/** The parent navigation button owns its label, focus, and click behavior. */
export function NavigationIcon({ name, active }: NavigationIconProps) {
  const [icon, animate] = useAnimate<SVGSVGElement>()
  const reducedMotion = useReducedMotion()
  const previousActive = useRef(active)

  useEffect(() => {
    const activated = active && !previousActive.current
    previousActive.current = active
    if (!icon.current) return

    // Never replay selection on mount or when returning from an artwork detail.
    if (reducedMotion || !active) {
      const reset = animate(icon.current, { opacity: 1 }, { duration: 0 })
      return () => reset.stop()
    }
    if (!activated) return

    const animation = animate(icon.current, { opacity: [.72, 1] }, {
      duration: .16,
      ease: 'easeOut',
    })
    return () => animation.stop()
  }, [active, reducedMotion, animate, icon])

  return (
    <svg
      ref={icon}
      className="dc-navigation-icon"
      data-icon={name}
      data-active={active}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flex: 'none', overflow: 'visible' }}
    >
      {name === 'daily' && (active
        ? <path fill="currentColor" stroke="none" d="m2.5 10.5 8.8-6.2a1.2 1.2 0 0 1 1.4 0l8.8 6.2-1 1.4-1.25-.88v8.23a1 1 0 0 1-1 1h-4v-5.75h-4.5v5.75h-4a1 1 0 0 1-1-1v-8.23L3.5 11.9Z" />
        : <g strokeWidth="1.75">
          <path d="m3 10.75 9-6.5 9 6.5" />
          <path d="M5.5 10.5v8.75a1 1 0 0 0 1 1h3.25V14.5h4.5v5.75h3.25a1 1 0 0 0 1-1V10.5" />
        </g>)}
      {name === 'search' && <PrototypeIconGlyph name="search" weight={active ? 'bold' : 'regular'} />}
      {name === 'create' && <PrototypeIconGlyph name="plus" weight={active ? 'bold' : 'regular'} />}
      {name === 'favourites' && <PrototypeIconGlyph name="heart" weight={active ? 'fill' : 'regular'} />}
      {name === 'settings' && <PrototypeIconGlyph name="user" weight={active ? 'fill' : 'regular'} />}
    </svg>
  )
}
