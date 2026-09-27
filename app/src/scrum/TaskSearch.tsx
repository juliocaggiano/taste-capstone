import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MagnifyingGlass, X } from './ProcessIcons';

export function TaskSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  return <div className="scrum-search" data-active={focused || Boolean(value)}>
    <motion.span className="scrum-search-icon" aria-hidden="true" animate={{ scale: reducedMotion ? 1 : focused ? 1.08 : 1, opacity: focused ? 1 : .7 }} transition={{ type: 'spring', bounce: 0, duration: reducedMotion ? 0 : .24 }}><MagnifyingGlass size={15} /></motion.span>
    <input ref={input} type="search" aria-label="Search tasks" placeholder="Search tasks" value={value} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={event => onChange(event.target.value)} onKeyDown={event => { if (event.key === 'Escape' && value) { event.preventDefault(); event.stopPropagation(); onChange(''); } }} />
    <motion.button type="button" className="scrum-search-clear" aria-label="Clear task search" aria-hidden={!value} disabled={!value} tabIndex={value ? 0 : -1} animate={{ opacity: value ? 1 : 0, scale: reducedMotion ? 1 : value ? 1 : .9 }} transition={{ duration: reducedMotion ? 0 : .15, ease: 'easeOut' }} onClick={() => { onChange(''); input.current?.focus(); }}><X size={13} /></motion.button>
  </div>;
}
