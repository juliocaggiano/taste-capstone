import { createContext, useContext, type ReactNode } from 'react';

type ProcessIconProps = { size?: number };
type ProcessIconFamily = 'panels' | 'tiles' | 'minimal';
type ProcessNavigationIconName = 'board' | 'list' | 'plan' | 'backlog' | 'about';
export type ProcessIconVariant = ProcessIconFamily | 'selected';
// Julio's selection combines individual glyphs across the comparison families.
const selectedIconFamilies: Record<ProcessNavigationIconName, ProcessIconFamily> = {
  board: 'tiles',
  list: 'tiles',
  plan: 'minimal',
  backlog: 'tiles',
  about: 'minimal',
};
export const ProcessIconVariantContext = createContext<ProcessIconVariant>('selected');
export function readProcessIconVariant(): ProcessIconVariant {
  const value = new URLSearchParams(window.location.search).get('process-icons');
  return value === 'panels' || value === 'tiles' || value === 'minimal' ? value : 'selected';
}

function navigationIcon(name: ProcessNavigationIconName) {
  return function ProcessNavigationIcon({ size = 16 }: ProcessIconProps) {
    const selection = useContext(ProcessIconVariantContext);
    const variant = selection === 'selected' ? selectedIconFamilies[name] : selection;
    return <svg data-process-icon={name} data-icon-variant={variant} data-icon-style="filled" width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><use href={`/assets/process-icons/variants.svg#${variant}-${name}`} /></svg>;
  };
}

// Original Taste drawings on a 16px optical grid. Filled silhouettes and
// transparent cutouts give the icons weight without changing control geometry.
// Keep semantics on the parent control; these glyphs are always decorative.
function icon(name: string, drawing: ReactNode) {
  return function ProcessIcon({ size = 16 }: ProcessIconProps) {
    return <svg data-process-icon={name} data-icon-style="filled" width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">{drawing}</svg>;
  };
}

export const Kanban = navigationIcon('board');
export const ListBullets = navigationIcon('list');
export const CalendarBlank = navigationIcon('plan');
export const Backlog = navigationIcon('backlog');
export const Info = navigationIcon('about');

export const SquaresFour = icon('workspace', <>
  <rect x="2" y="2" width="4.25" height="4.25" rx=".75" />
  <rect x="9.75" y="2" width="4.25" height="4.25" rx=".75" />
  <rect x="2" y="9.75" width="4.25" height="4.25" rx=".75" />
  <rect x="9.75" y="9.75" width="4.25" height="4.25" rx=".75" />
</>);

export const MagnifyingGlass = icon('search', <>
  <path fillRule="evenodd" d="M6.75 1.25a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
  <path d="m9.5 11 3.5 3.5a1.06 1.06 0 0 0 1.5-1.5L11 9.5Z" />
</>);

export const Plus = icon('plus', <path d="M7 1.75h2V7h5.25v2H9v5.25H7V9H1.75V7H7Z" />);
export const X = icon('close', <path d="m3.5 2 4.5 4.5L12.5 2 14 3.5 9.5 8l4.5 4.5-1.5 1.5L8 9.5 3.5 14 2 12.5 6.5 8 2 3.5Z" />);
export const Check = icon('check', <path d="m1.75 8 1.5-1.5 3 3 6.5-6.5 1.5 1.5-8 8Z" />);
// An empty center keeps unfinished work distinct from the solid Done marker.
export const Circle = icon('todo', <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3Z" />);
export const CheckCircle = icon('done', <>
  <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM3.75 8l1.1-1.1L7 9.05l4.15-4.15 1.1 1.1L7 11.25 3.75 8Z" />
</>);
export const ArrowUp = icon('arrow-up', <path d="m8 1.5 5.5 5.5L12 8.5l-3-3v9H7v-9l-3 3L2.5 7Z" />);
export const ArrowDown = icon('arrow-down', <path d="m8 14.5 5.5-5.5L12 7.5l-3 3v-9H7v9l-3-3L2.5 9Z" />);
