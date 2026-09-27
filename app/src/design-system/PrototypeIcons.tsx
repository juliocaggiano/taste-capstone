import type { SVGProps } from 'react'

export type PrototypeIconWeight = 'light' | 'regular' | 'bold' | 'fill'
export type PrototypeIconProps = SVGProps<SVGSVGElement> & {
  size?: number
  weight?: PrototypeIconWeight
}

export type PrototypeIconName =
  | 'arrow-right' | 'arrow-up-left' | 'caret-left' | 'caret-right' | 'caret-down'
  | 'check' | 'check-circle' | 'globe' | 'heart' | 'image' | 'search'
  | 'paper-plane' | 'share' | 'shuffle' | 'sparkle' | 'sliders' | 'star' | 'trash'
  | 'upload' | 'download' | 'close' | 'plus' | 'grid' | 'list' | 'house' | 'gear' | 'user'

const strokeWeights: Record<PrototypeIconWeight, number> = {
  light: 1.5,
  regular: 1.75,
  bold: 2.1,
  fill: 1.75,
}

/** Original Taste glyphs. Parent controls own labels, focus, and interaction. */
export function PrototypeIconGlyph({ name, weight = 'regular' }: {
  name: PrototypeIconName
  weight?: PrototypeIconWeight
}) {
  const filled = weight === 'fill'
  let drawing

  switch (name) {
    case 'arrow-right':
      drawing = <path d="M4.5 12h15m-6-6 6 6-6 6" />
      break
    case 'arrow-up-left':
      drawing = <path d="M18.5 18.5 5.5 5.5m0 9v-9h9" />
      break
    case 'caret-left':
      drawing = <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
      break
    case 'caret-right':
      drawing = <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
      break
    case 'caret-down':
      drawing = <path d="m5.5 9 6.5 6.5L18.5 9" />
      break
    case 'check':
      drawing = <path d="m4.5 12 5 5 10-10" />
      break
    case 'check-circle':
      drawing = filled
        ? <path fill="currentColor" stroke="none" fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.8 12.25-3.1-3.1-1.25 1.25 4.35 4.35 7.65-7.65-1.25-1.25-6.4 6.4Z" />
        : <><circle cx="12" cy="12" r="9" /><path d="m7 12 3.25 3.25L17 8.5" /></>
      break
    case 'globe':
      drawing = <>
        <circle cx="12" cy="12" r="9" />
        <path fill="currentColor" stroke="none" d="m5.25 5.75 3.25-2 4 .25 1.75 2.5-2.5 2.25-2.5-.5-.75 2.5-3-.75L4 8Zm3.25 6 3.25-1.25 3.75 2-1.25 3.25-2 1.25-.75 3.25-2.25-2-.5-3.25-2-1.25Z" />
      </>
      break
    case 'heart':
      drawing = <path d="M12 20 4.75 12.75a4.95 4.95 0 0 1 7-7L12 6l.25-.25a4.95 4.95 0 0 1 7 7Z" fill={filled ? 'currentColor' : 'none'} />
      break
    case 'image':
      drawing = <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
        <circle cx="8.25" cy="8.25" r="1.5" fill="currentColor" stroke="none" />
        <path d="m4 17 4.5-4.5 3.25 3.25L16.5 11l3.5 3.5V20H4Z" fill="currentColor" stroke="none" />
      </>
      break
    case 'search':
      drawing = <><circle cx="10.5" cy="10.5" r="6.75" /><path d="m15.5 15.5 4.75 4.75" /></>
      break
    case 'paper-plane':
      drawing = <path fill="currentColor" stroke="none" d="M3.5 9.5 20.5 3.5 10.75 11.75ZM12.25 13.25 20.5 3.5 14.5 20.5Z" />
      break
    case 'share':
      drawing = <><path d="M12 14.5V3.5m-4 4 4-4 4 4" /><path d="M7.5 10H4.5v10h15V10h-3" /></>
      break
    case 'shuffle':
      drawing = <><path d="M4 7h3l10 10h3m-3-3 3 3-3 3" /><path d="M4 17h3l4-4m2-2 4-4h3m-3-3 3 3-3 3" /></>
      break
    case 'sparkle':
      drawing = <path fill="currentColor" stroke="none" d="m12 2.5 2.75 6.75L21.5 12l-6.75 2.75L12 21.5l-2.75-6.75L2.5 12l6.75-2.75Z" />
      break
    case 'sliders':
      drawing = <>
        <path d="M3.5 6h17M3.5 12h17M3.5 18h17" />
        <path d="M9.5 3.75v4.5m5 1.5v4.5m-7 1.5v4.5" strokeWidth="3" />
      </>
      break
    case 'star':
      drawing = <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.05 6.2L12 17.25l-5.55 2.95 1.05-6.2L3 9.6l6.2-.9Z" fill={filled ? 'currentColor' : 'none'} />
      break
    case 'trash':
      drawing = <>
        <path d="M3.5 6.5h17M9 6.5V3.75h6V6.5M6 6.5v13.75h12V6.5" />
        <path d="M10 10v6.5M14 10v6.5" />
      </>
      break
    case 'upload':
      drawing = <><path d="M12 15.5v-12M7.5 8 12 3.5 16.5 8" /><path d="M4 15v5h16v-5" /></>
      break
    case 'download':
      drawing = <><path d="M12 3.5v12m-4.5-4.5 4.5 4.5 4.5-4.5" /><path d="M4 16v4h16v-4" /></>
      break
    case 'close':
      drawing = <path d="m6 6 12 12M18 6 6 18" />
      break
    case 'plus':
      drawing = <path d="M12 4v16M4 12h16" />
      break
    case 'grid':
      drawing = <g fill="currentColor" stroke="none">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
      </g>
      break
    case 'list':
      drawing = <g fill="currentColor" stroke="none">
        <rect x="3.5" y="4" width="17" height="3" rx=".75" />
        <rect x="3.5" y="10.5" width="17" height="3" rx=".75" />
        <rect x="3.5" y="17" width="17" height="3" rx=".75" />
      </g>
      break
    case 'house':
      drawing = <path d="m4 10 8-5.5 8 5.5v9.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z" fill={filled ? 'currentColor' : 'none'} />
      break
    case 'user':
      drawing = <>
        <circle cx="12" cy="7" r="3.5" fill={filled ? 'currentColor' : 'none'} />
        <path d="M4.5 20.5v-1.75A5.75 5.75 0 0 1 10.25 13h3.5a5.75 5.75 0 0 1 5.75 5.75v1.75Z" fill={filled ? 'currentColor' : 'none'} />
      </>
      break
    case 'gear':
      drawing = <>
        <path d="M9.5 2.75h5l.45 2.1 1.7.7 1.8-1.15 2.75 2.75-1.15 1.8.7 1.7 2.1.45v2l-2.1.45-.7 1.7 1.15 1.8-2.75 2.75-1.8-1.15-1.7.7-.45 2.1h-5l-.45-2.1-1.7-.7-1.8 1.15-2.75-2.75 1.15-1.8-.7-1.7-2.1-.45v-2l2.1-.45.7-1.7-1.15-1.8L5.5 4.4l1.8 1.15 1.7-.7.5-2.1Z" />
        <circle cx="12" cy="12" r="3" />
      </>
      break
  }

  return <g fill="none" stroke="currentColor" strokeWidth={strokeWeights[weight]} strokeLinecap="round" strokeLinejoin="round">{drawing}</g>
}

function icon(name: PrototypeIconName) {
  return function PrototypeIcon({ size = 24, weight = 'regular', ...props }: PrototypeIconProps) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props} data-prototype-icon={name} aria-hidden="true" focusable="false">
      <PrototypeIconGlyph name={name} weight={weight} />
    </svg>
  }
}

export const ArrowRight = icon('arrow-right')
export const ArrowUpLeft = icon('arrow-up-left')
export const CaretLeft = icon('caret-left')
export const CaretRight = icon('caret-right')
export const CaretDown = icon('caret-down')
export const Check = icon('check')
export const CheckCircle = icon('check-circle')
export const GlobeHemisphereWest = icon('globe')
export const Heart = icon('heart')
export const ImageSquare = icon('image')
export const MagnifyingGlass = icon('search')
export const PaperPlaneTilt = icon('paper-plane')
export const Share = icon('share')
export const Shuffle = icon('shuffle')
export const Sparkle = icon('sparkle')
export const SlidersHorizontal = icon('sliders')
export const Star = icon('star')
export const TrashSimple = icon('trash')
export const UploadSimple = icon('upload')
export const DownloadSimple = icon('download')
export const X = icon('close')
export const Plus = icon('plus')
export const GridFour = icon('grid')
export const List = icon('list')
export const House = icon('house')
export const Gear = icon('gear')
export const User = icon('user')
