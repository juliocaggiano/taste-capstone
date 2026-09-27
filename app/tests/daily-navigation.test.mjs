import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { transformWithOxc } from "vite";

// Execute the production DailyPager effect and keyboard handler. Only its JSX
// return is omitted; no navigation decisions are copied into this harness.
// The protected Carousel's offsets and data-dragging transitions are inputs.
const sourcePath = process.env.DAILY_NAVIGATION_SOURCE ?? new URL("../src/Prototype.tsx", import.meta.url);
const sourceText = readFileSync(sourcePath, "utf8");
const start = sourceText.indexOf("\nfunction DailyPager(");
const end = sourceText.indexOf("\nfunction ContributionBanner(", start);
assert.ok(start >= 0 && end > start, "Production DailyPager boundaries exist");
const pager = sourceText.slice(start, end);
const jsxReturn = pager.lastIndexOf("\n  return (");
assert.ok(jsxReturn > 0, "DailyPager has its component return");
const executable = pager.slice(0, jsxReturn)
  + "return { handleKeyDown, shuffleArtwork }; }";
const { code: compiled } = await transformWithOxc(executable, "DailyPager.ts");

function makeClock() {
  let now = 0;
  let nextId = 0;
  const jobs = new Map();
  const setTimeout = (callback, delay = 0) => {
    const id = ++nextId;
    jobs.set(id, { at: now + delay, callback });
    return id;
  };
  return {
    setTimeout,
    clearTimeout: (id) => jobs.delete(id),
    cancelAnimationFrame: (id) => jobs.delete(id),
    requestAnimationFrame: (callback) => setTimeout(() => callback(now), 16),
    tick(milliseconds) {
      const end = now + milliseconds;
      let count = 0;
      while (true) {
        const next = [...jobs].filter(([, job]) => job.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        assert.ok(++count < 10_000, "Mock clock reaches an idle state");
        jobs.delete(next[0]);
        now = next[1].at;
        next[1].callback();
      }
      now = end;
    },
  };
}

function createPager({ width = 393, renderedScale = 1, initialIndex = 0, random = .5 } = {}) {
  const clock = makeClock();
  const observers = new Map();
  class Element {
    constructor() {
      this.listeners = new Map();
      this.dataset = { dragging: "false" };
      this.clientWidth = width;
      this.scrollTop = 0;
      this.scrollHeight = 1500;
      this.position = 0;
      this.nearestCarousel = null;
    }
    querySelector() { return null; }
    addEventListener(type, listener) {
      const listeners = this.listeners.get(type) ?? new Set();
      listeners.add(listener);
      this.listeners.set(type, listeners);
    }
    removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
    dispatch(type, detail = {}) {
      const event = {
        type, target: this, pointerId: 1, pointerType: "mouse", button: 0,
        defaultPrevented: false,
        preventDefault() { this.defaultPrevented = true; },
        stopPropagation() {},
        ...detail,
      };
      for (const listener of this.listeners.get(type) ?? []) listener(event);
      return event;
    }
    closest(selector) { return selector === ".mobile-carousel" ? this.nearestCarousel : null; }
    getBoundingClientRect() { return { width: width * renderedScale }; }
    get scrollLeft() { return this.position; }
    set scrollLeft(value) {
      if (value === this.position) return;
      this.position = value;
      // Browser scroll events arrive after the assignment, allowing the
      // production forceScrollLeft guard to suppress its own corrections.
      clock.setTimeout(() => this.dispatch("scroll"), 0);
    }
    scrollTo({ left }) { this.scrollLeft = left; }
    setDragging(value) {
      this.dataset.dragging = String(value);
      for (const callback of observers.get(this) ?? []) callback();
    }
  }
  const carousel = new Element();
  carousel.nearestCarousel = carousel;
  const vertical = new Element();
  const article = new Element();
  article.nearestCarousel = carousel;
  const nestedRail = new Element();
  nestedRail.nearestCarousel = nestedRail;
  const slides = Array.from({ length: 5 }, () => new Element());
  const root = {
    querySelector(selector) {
      if (selector === ".daily-pager") return carousel;
      if (selector === ".mobile-scroll") return vertical;
      const index = selector.match(/data-index="(\d+)"/);
      return index ? slides[Number(index[1])] : null;
    },
    querySelectorAll: () => slides,
  };
  const effects = [];
  const states = [];
  const editions = [];
  let refCount = 0;
  const context = vm.createContext({
    window: clock,
    Element,
    Math: Object.assign(Object.create(Math), { random: () => random }),
    useReducedMotion: () => true,
    useEffect: (callback) => effects.push(callback),
    useRef: (initial) => ({ current: refCount++ === 0 ? root : initial }),
    useState(initial) {
      const index = states.push(initial) - 1;
      return [initial, (value) => { states[index] = typeof value === "function" ? value(states[index]) : value; }];
    },
    useLayoutEffect: (callback) => effects.push(callback),
    MutationObserver: class {
      constructor(callback) { this.callback = callback; this.targets = []; }
      observe(target) {
        const callbacks = observers.get(target) ?? new Set();
        callbacks.add(this.callback);
        observers.set(target, callbacks);
        this.targets.push(target);
      }
      disconnect() { this.targets.forEach((target) => observers.get(target)?.delete(this.callback)); }
    },
    ResizeObserver: class { observe() {} disconnect() {} },
    formatDailyDate: (index) => `edition-${index}`,
  });
  vm.runInContext(compiled, context, { filename: "DailyPager.extracted.js" });
  const controls = context.DailyPager({
    pieces: Array.from({ length: 4 }, (_, index) => ({ id: `piece-${index}`, title: `Edition ${index}`, image: "image.jpg" })),
    initialIndex,
    contributionCopy: { slideAria: "Suggest a story" },
    onIndexChange: (index) => editions.push(index),
  });
  const cleanups = effects.map((effect) => effect());
  clock.tick(20);
  return {
    carousel, vertical, article, nestedRail, clock, editions,
    get index() { return states[0]; },
    dispose() { cleanups.forEach((cleanup) => cleanup?.()); },
    pointer(type, x, y = 200, target = article) {
      carousel.dispatch(type, { clientX: x, clientY: y, target });
    },
    wheel(deltaX, { deltaY = 0, deltaMode = 0, ctrlKey = false, target = article } = {}) {
      return carousel.dispatch("wheel", { deltaX, deltaY, deltaMode, ctrlKey, target, cancelable: true });
    },
    begin(x = 300, y = 200) {
      this.pointer("pointerdown", x, y);
      carousel.setDragging(true);
    },
    release(x, { y = 200, cancelled = false } = {}) {
      // Native capture listener runs before Carousel's React release handler
      // changes data-dragging and begins momentum.
      this.pointer(cancelled ? "pointercancel" : "pointerup", x, y);
      carousel.setDragging(false);
    },
    momentum(left) {
      // Carousel begins momentum on requestAnimationFrame, never synchronously
      // inside pointerup. Preserve that order around programmatic-move guards.
      clock.requestAnimationFrame(() => { carousel.scrollLeft = left; });
      clock.tick(36);
    },
    settle() { clock.tick(800); },
    key(key) { controls.handleKeyDown({ key, preventDefault() {} }); },
    shuffle() { controls.shuffleArtwork(); },
  };
}

test("net-left drag reaches Suggestion despite reversed release momentum", () => {
  const p = createPager();
  p.begin(300);
  p.carousel.scrollLeft = 1179 + 120;
  p.clock.tick(20);
  p.release(180);
  p.momentum(0); // A fast rightward correction would otherwise reach an older edition.
  assert.ok(p.carousel.scrollLeft >= 1179, "Release motion cannot cross Today toward yesterday");
  p.settle();
  assert.equal(p.index, 4);
  assert.equal(p.carousel.scrollLeft, 1572);
  assert.deepEqual(p.editions, [], "Suggestion does not overwrite the remembered Daily edition");
  p.dispose();
});

test("net-right drag reaches yesterday despite reversed release momentum", () => {
  const p = createPager();
  p.begin(100);
  p.carousel.scrollLeft = 1179 - 120;
  p.clock.tick(20);
  p.release(220);
  p.momentum(1572);
  assert.ok(p.carousel.scrollLeft <= 1179, "Release motion cannot cross Today toward Suggestion");
  p.settle();
  assert.equal(p.index, 2);
  assert.equal(p.carousel.scrollLeft, 786);
  assert.equal(p.editions.at(-1), 1);
  p.dispose();
});

for (const [name, endX, options] of [
  ["short drag", 280, {}],
  ["cancelled drag", 180, { cancelled: true }],
  ["vertical-dominant drag", 180, { y: 400 }],
]) {
  test(`${name} stays on Today despite release momentum`, () => {
    const p = createPager();
    p.begin(300);
    p.release(endX, options);
    p.momentum(1572);
    p.settle();
    assert.equal(p.index, 3);
    assert.equal(p.carousel.scrollLeft, 1179);
    p.dispose();
  });
}

test("drag threshold uses phone coordinates when the preview is scaled down", () => {
  const p = createPager({ renderedScale: 0.5 });
  p.begin(300);
  p.release(275); // 25 screen pixels equal 50 phone pixels.
  p.settle();
  assert.equal(p.index, 4);
  p.dispose();
});

test("a short phone-space drag stays put when the preview is scaled up", () => {
  const p = createPager({ renderedScale: 2 });
  p.begin(300);
  p.release(240); // 60 screen pixels equal only 30 phone pixels.
  p.momentum(1572);
  p.settle();
  assert.equal(p.index, 3);
  p.dispose();
});

test("nested recommendation gestures do not navigate Daily", () => {
  const p = createPager();
  p.pointer("pointerdown", 300, 200, p.nestedRail);
  p.nestedRail.setDragging(true);
  p.nestedRail.scrollLeft = 250;
  p.pointer("pointerup", 100, 200, p.nestedRail);
  p.nestedRail.setDragging(false);
  p.settle();
  assert.equal(p.index, 3);
  assert.equal(p.carousel.scrollLeft, 1179);
  assert.equal(p.nestedRail.scrollLeft, 250);
  assert.deepEqual(p.editions, []);
  p.dispose();
});

test("keyboard navigation during a drag supersedes its pending release", () => {
  const p = createPager();
  p.begin(100);
  p.carousel.scrollLeft = 1036;
  p.clock.tick(20);
  p.key("ArrowLeft");
  p.release(220);
  p.momentum(0);
  p.settle();
  assert.equal(p.index, 4);
  assert.equal(p.carousel.scrollLeft, 1572);
  assert.deepEqual(p.editions, []);
  p.dispose();
});

test("leftward wheel input opens Suggestion and rightward input returns toward past editions", () => {
  const p = createPager();
  assert.equal(p.wheel(-120).defaultPrevented, true, "Daily owns horizontal wheel navigation");
  p.settle();
  assert.equal(p.index, 4);
  assert.equal(p.carousel.scrollLeft, 1572);
  assert.deepEqual(p.editions, [], "Suggestion preserves the remembered Today edition");
  p.wheel(120);
  p.settle();
  assert.equal(p.index, 3);
  assert.equal(p.carousel.scrollLeft, 1179);
  p.wheel(120);
  p.settle();
  assert.equal(p.index, 2);
  assert.equal(p.carousel.scrollLeft, 786);
  assert.equal(p.editions.at(-1), 1);
  p.wheel(-120);
  p.settle();
  assert.equal(p.index, 3, "Leftward wheel input returns from yesterday to Today");
  p.dispose();
});

for (const direction of [-1, 1]) {
  test(`${direction < 0 ? "leftward" : "rightward"} wheel bursts advance one edition including trailing momentum`, () => {
    const p = createPager({ initialIndex: 1 });
    const expectedIndex = direction < 0 ? 3 : 1;
    for (let step = 0; step < 8; step++) {
      p.wheel(direction * 180);
      p.clock.tick(25);
    }
    p.clock.tick(180);
    assert.equal(p.index, expectedIndex);
    // The burst settled, but a small tail inside its 420ms idle window still
    // belongs to that burst. Even accumulated tails cannot choose another day.
    for (let step = 0; step < 12; step++) {
      p.wheel(direction * 8);
      p.clock.tick(50);
    }
    p.settle();
    assert.equal(p.index, expectedIndex);
    assert.equal(p.carousel.scrollLeft, expectedIndex * 393);
    p.wheel(direction * 120);
    p.settle();
    assert.equal(p.index, expectedIndex - direction, "A fresh burst advances the next edition");
    p.dispose();
  });
}

test("short wheel bursts stay on the current edition", () => {
  const p = createPager();
  p.wheel(-15);
  p.clock.tick(40);
  p.wheel(-20);
  p.settle();
  assert.equal(p.index, 3);
  assert.equal(p.carousel.scrollLeft, 1179);
  p.dispose();
});

for (const direction of [-1, 1]) {
  test(`${direction < 0 ? "net-left" : "net-right"} wheel input ignores a final direction correction`, () => {
    const p = createPager();
    p.wheel(direction * 120);
    p.clock.tick(40);
    p.wheel(-direction * 50);
    p.settle();
    const expectedIndex = direction < 0 ? 4 : 2;
    assert.equal(p.index, expectedIndex);
    assert.equal(p.carousel.scrollLeft, expectedIndex * 393);
    p.dispose();
  });
}

for (const [name, deltaX, deltaMode, expectedIndex] of [
  ["two line units remain below the threshold", -2, 1, 3],
  ["three line units clear the threshold", -3, 1, 4],
  ["page units use the carousel width", -0.2, 2, 4],
]) {
  test(`wheel delta normalization: ${name}`, () => {
    const p = createPager();
    p.wheel(deltaX, { deltaMode });
    p.settle();
    assert.equal(p.index, expectedIndex);
    assert.equal(p.carousel.scrollLeft, expectedIndex * 393);
    p.dispose();
  });
}

test("nested rails, vertical wheel input, and pinch zoom remain outside Daily navigation", () => {
  const p = createPager();
  const events = [
    p.wheel(-120, { target: p.nestedRail }),
    p.wheel(-60, { deltaY: 140 }),
    p.wheel(-120, { ctrlKey: true }),
  ];
  assert.ok(events.every((event) => !event.defaultPrevented), "Ignored inputs retain their native behavior");
  p.settle();
  assert.equal(p.index, 3);
  assert.equal(p.carousel.scrollLeft, 1179);
  assert.deepEqual(p.editions, []);
  p.dispose();
});

test("keyboard navigation overrides a pending wheel destination", () => {
  const p = createPager();
  p.wheel(-120);
  p.clock.tick(60);
  p.key("ArrowRight");
  p.settle();
  assert.equal(p.index, 2);
  assert.equal(p.carousel.scrollLeft, 786);
  p.dispose();
});

test("pointer navigation overrides a pending wheel destination", () => {
  const p = createPager();
  p.wheel(-120);
  p.clock.tick(60);
  p.begin(100);
  p.carousel.scrollLeft = 1059;
  p.clock.tick(20);
  p.release(220);
  p.momentum(0);
  p.settle();
  assert.equal(p.index, 2);
  assert.equal(p.carousel.scrollLeft, 786);
  p.dispose();
});

test("wheel navigation still works after the parent captures a vertical pointer gesture", () => {
  const p = createPager();
  p.pointer("pointerdown", 200, 400);
  // MobileScroll owns this vertical gesture and receives the release through
  // pointer capture. The carousel's pointerup listener does not receive it.
  p.vertical.scrollTop = 220;
  p.clock.tick(180);
  p.wheel(-120);
  p.settle();
  assert.equal(p.index, 4);
  assert.equal(p.carousel.scrollLeft, 1572);
  p.dispose();
});

test("a trailing wheel event cannot override the pointer gesture that interrupted its burst", () => {
  const p = createPager();
  p.wheel(-120);
  p.clock.tick(60);
  p.begin(100);
  p.carousel.scrollLeft = 1059;
  p.clock.tick(20);
  p.release(220);
  p.momentum(0);
  p.clock.tick(180);
  assert.equal(p.index, 2, "The rightward pointer gesture has settled on yesterday");
  p.wheel(-80);
  p.settle();
  assert.equal(p.index, 2, "The earlier wheel burst cannot select a new day");
  assert.equal(p.carousel.scrollLeft, 786);
  p.wheel(-120);
  p.settle();
  assert.equal(p.index, 3, "A fresh wheel gesture works after the interrupted burst expires");
  p.dispose();
});


test("shuffle skips the current edition and contribution, including range boundaries", () => {
  for (const initialIndex of [0, 1, 2, 3]) {
    for (const random of [0, .5, .999999]) {
      const p = createPager({ initialIndex, random });
      const before = p.index;
      p.vertical.scrollTop = 240;
      p.shuffle();
      p.settle();
      assert.notEqual(p.index, before);
      assert.ok(p.index >= 0 && p.index < 4, "Only featured artworks are eligible");
      assert.equal(p.carousel.scrollLeft, p.index * 393);
      assert.equal(p.vertical.scrollTop, 0);
      assert.equal(p.editions.at(-1), 3 - p.index);
      p.dispose();
    }
  }
});

test("shuffle consumes wheel momentum and subsequent keyboard navigation starts at its result", () => {
  const p = createPager({ random: 0 });
  p.wheel(180);
  p.clock.tick(20);
  p.shuffle();
  p.wheel(120);
  p.settle();
  assert.equal(p.index, 0);
  assert.equal(p.carousel.scrollLeft, 0);
  p.key("ArrowLeft");
  p.settle();
  assert.equal(p.index, 1);
  p.dispose();
});
