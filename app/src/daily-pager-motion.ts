/** Daily owns snapping; the shared Carousel remains responsible for nested rails. */
export const dailyDestination = (anchor: number, displacement: number, count: number) =>
  Math.max(0, Math.min(count - 1, anchor + (Math.abs(displacement) >= 40 ? Math.sign(displacement) : 0)));
export const dailyOffset = (anchor: number, displacement: number, width: number, count: number) =>
  Math.max(Math.max(0, anchor - 1) * width, Math.min(Math.min(count - 1, anchor + 1) * width, anchor * width + displacement));
export const dailyEase = (progress: number) => 1 - (1 - Math.min(1, Math.max(0, progress))) ** 3;

export function attachDailyMotion(node: HTMLElement, options: {
  count: number; index: () => number; commit: (index: number) => void; reducedMotion: boolean;
}) {
  let frame = 0;
  let settleTimer = 0;
  let idleTimer = 0;
  let suppressClick = false;
  let wheel: { anchor: number; displacement: number; target: number | null } | null = null;
  let pointer: { id: number; x: number; y: number; anchor: number; start: number; scale: number; dragging: boolean } | null = null;
  const width = () => Math.max(1, node.clientWidth);
  const owns = (target: EventTarget | null) => target instanceof Element && target.closest('.mobile-carousel') === node;
  const stop = () => { cancelAnimationFrame(frame); frame = 0; };
  const animate = (index: number, immediate = false) => {
    stop();
    const from = node.scrollLeft;
    const to = index * width();
    // Commit once, before the animation. No scroll observer corrects our frames.
    options.commit(index);
    if (immediate || options.reducedMotion || Math.abs(to - from) < .5) { node.scrollLeft = to; return; }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 260);
      node.scrollLeft = from + (to - from) * dailyEase(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else frame = 0;
    };
    frame = requestAnimationFrame(tick);
  };
  const resetWheel = () => { clearTimeout(settleTimer); clearTimeout(idleTimer); wheel = null; };
  const releasePointer = () => {
    const prior = pointer;
    pointer = null;
    node.dataset.dailyDragging = 'false';
    if (prior && node.hasPointerCapture(prior.id)) node.releasePointerCapture(prior.id);
  };
  const down = (event: PointerEvent) => {
    if (!owns(event.target) || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    stop(); resetWheel(); suppressClick = false;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, anchor: options.index(), start: node.scrollLeft,
      scale: width() / Math.max(1, node.getBoundingClientRect().width), dragging: false };
  };
  const move = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = (pointer.x - event.clientX) * pointer.scale;
    const dy = (pointer.y - event.clientY) * pointer.scale;
    if (!pointer.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { releasePointer(); return; }
      pointer.dragging = true;
      node.setPointerCapture(event.pointerId);
      node.dataset.dailyDragging = 'true';
      suppressClick = true;
    }
    event.preventDefault(); event.stopPropagation();
    node.scrollLeft = dailyOffset(pointer.anchor, pointer.start - pointer.anchor * width() + dx, width(), options.count);
  };
  const finish = (event: PointerEvent) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const { anchor, dragging, x, scale } = pointer;
    releasePointer();
    if (!dragging) return;
    event.preventDefault(); event.stopPropagation();
    animate(dailyDestination(anchor, event.type === 'pointercancel' ? 0 : (x - event.clientX) * scale, options.count));
  };
  const settleWheel = () => {
    if (!wheel || wheel.target !== null) return;
    wheel.target = dailyDestination(wheel.anchor, wheel.displacement, options.count);
    animate(wheel.target);
  };
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.defaultPrevented || !owns(event.target)) return;
    // Keep the initial axis for the entire burst, including vertical inertia.
    if (!wheel && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    if (pointer?.dragging) return;
    if (!wheel) { stop(); wheel = { anchor: options.index(), displacement: 0, target: null }; }
    if (wheel.target === null) {
      const unit = event.deltaMode === 2 ? width() : event.deltaMode === 1 ? 16 : width() / Math.max(1, node.getBoundingClientRect().width);
      wheel.displacement -= event.deltaX * unit;
      node.scrollLeft = dailyOffset(wheel.anchor, wheel.displacement, width(), options.count);
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settleWheel, 160);
    }
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => { settleWheel(); wheel = null; }, 420);
  };
  const click = (event: MouseEvent) => {
    if (!suppressClick) return;
    suppressClick = false; event.preventDefault(); event.stopPropagation();
  };
  node.addEventListener('pointerdown', down, true);
  node.addEventListener('pointermove', move, true);
  node.addEventListener('pointerup', finish, true);
  node.addEventListener('pointercancel', finish, true);
  node.addEventListener('wheel', onWheel, { passive: false });
  node.addEventListener('click', click, true);
  return {
    move(index: number, immediate = false) {
      stop(); releasePointer();
      if (wheel) { wheel.target = index; clearTimeout(settleTimer); }
      animate(index, immediate);
    },
    dispose() {
      stop(); resetWheel(); releasePointer();
      node.removeEventListener('pointerdown', down, true);
      node.removeEventListener('pointermove', move, true);
      node.removeEventListener('pointerup', finish, true);
      node.removeEventListener('pointercancel', finish, true);
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('click', click, true);
    },
  };
}
