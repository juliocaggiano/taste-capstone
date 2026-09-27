import { APP_FILE_PREFIX, APP_LABEL, APP_VERSION } from "../brand";
import { SquaresFour as ProcessWorkspaceIcon } from "../scrum/ProcessIcons";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowSquareOut, BookOpen, CaretDown, Check, Copy, DownloadSimple, Heart, MagnifyingGlass, Plus, SquaresFour, List, X } from "@phosphor-icons/react";
import { useKeyboard } from "../mobile";
import { ArtworkCard, Button, Chip, Toggle } from "./components";
import { PreviewCode } from "./PreviewCode";
import { MorphingSelect } from "./MorphingSelect";
import { LikeButton } from "./LikeButton";
import * as PrototypeIcons from "./PrototypeIcons";
import { SelectionShowcase } from "./SelectionShowcase";
import { ArtworkInformationShowcase } from "./ArtworkInformationShowcase";
import { neutralColors, darkColors, compactSpacingTokens, typeTokens, tokenDocument } from "./tokens";
import { DailyStoryPattern, SearchDiscoveryPattern, sampleArtworks } from "./patterns";
import { downloadFile, newComponentBrief, systemAssets } from "./assets";
import "./tokens.css";
import "./components.css";
import "./design-system.css";
import { ScrumWorkspace } from "../scrum/ScrumWorkspace";

const sections = ["Overview", "Foundations", "Components", "Patterns", "Assets", "Guidelines"] as const;
type Section = typeof sections[number];
type NavigationItem = { label: string; section: Section; anchor?: string };
const navigation: { title: string; items: NavigationItem[] }[] = [
  { title: "Foundations", items: [{ label: "Introduction", section: "Overview" }, { label: "Color", section: "Foundations", anchor: "color" }, { label: "Typography", section: "Foundations", anchor: "typography" }, { label: "Space & shape", section: "Foundations", anchor: "space-shape" }] },
  { title: "Components", items: [{ label: "Buttons", section: "Components", anchor: "buttons" }, { label: "Like button", section: "Components", anchor: "like-button" }, { label: "Filter chips", section: "Components", anchor: "filter-chips" }, { label: "Morphing select", section: "Components", anchor: "morphing-select" }, { label: "Selection pills", section: "Components", anchor: "selection-pills" }, { label: "Rounded surfaces", section: "Components", anchor: "rounded-surfaces" }, { label: "Artwork cards", section: "Components", anchor: "artwork-cards" }, { label: "Artwork information", section: "Components", anchor: "artwork-information" }, { label: "Toggle", section: "Components", anchor: "toggle" }] },
  { title: "Patterns", items: [{ label: "Daily", section: "Patterns", anchor: "daily-a-work-and-its-story" }, { label: "Search", section: "Patterns", anchor: "search-discovery-and-a-gallery" }] },
  { title: "Resources", items: [{ label: "Icons", section: "Assets", anchor: "icons" }, { label: "Compositions", section: "Assets", anchor: "ready-made-compositions" }, { label: "Artwork & content", section: "Assets", anchor: "artwork-content" }, { label: "Guidelines", section: "Guidelines" }] },
];
const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const paperUrl = "https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0";
const componentImport = 'import { Button, Chip, ArtworkCard, Toggle } from "./design-system/components";';

function CopyAction({ value, label = "Copy component", onStatus }: { value: string; label?: string; onStatus: (message: string) => void }) {
  return <button type="button" className="ds-text-action" onClick={async () => {
    try { await navigator.clipboard.writeText(value); onStatus("Copied usage example. Connect callbacks in your screen."); }
    catch { downloadFile(`${APP_FILE_PREFIX}-example.tsx`, value); onStatus("Clipboard unavailable. Example downloaded instead."); }
  }}><Copy size={15} />{label}</button>;
}

export type WorkspaceView = "app" | "onboarding" | "design-system" | "scrum";
export const readWorkspaceView = (): WorkspaceView => {
  const view = new URLSearchParams(window.location.search).get("view");
  return view === "onboarding" || view === "design-system" || view === "scrum" ? view : "app";
};
function ViewPicker({ view, onChange }: { view: WorkspaceView; onChange: (view: WorkspaceView) => void }) {
  return <MorphingSelect className="ds-view-picker" ariaLabel="Workspace view" value={view} onChange={value => onChange(value as WorkspaceView)} variant="dark" leadingIcon={view === "scrum" ? <ProcessWorkspaceIcon size={17} /> : <SquaresFour size={17} aria-hidden="true" />} options={[
    { value: "app", label: "Prototype" },
    { value: "onboarding", label: "Prototype / Onboarding" },
    { value: "design-system", label: "Design system" },
    { value: "scrum", label: "Process documentation" },
  ]} />;
}

function formatWorkspaceClock(date: Date, compact = false) {
  const weekday = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: compact ? "short" : "long" }).format(date);
  const day = date.getDate();
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ?? "th";
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(date)
    .replace(/\sAM$/, " a.m.").replace(/\sPM$/, " p.m.");
  return compact ? `${month} ${day}, ${time}` : `${weekday}, ${month} ${day}${suffix}, ${time}`;
}

function WorkspaceClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let timer: number;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, 60_000 - Date.now() % 60_000 + 50);
    };
    timer = window.setTimeout(tick, 60_000 - Date.now() % 60_000 + 50);
    const refresh = () => { if (document.visibilityState === "visible") setNow(new Date()); };
    document.addEventListener("visibilitychange", refresh);
    return () => { window.clearTimeout(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  const full = formatWorkspaceClock(now);
  return <time className="dc-workspace-datetime" dateTime={now.toISOString()} aria-label={full} title={full}>
    <span className="dc-workspace-datetime-full">{full}</span>
    <span className="dc-workspace-datetime-compact" aria-hidden="true">{formatWorkspaceClock(now, true)}</span>
  </time>;
}

function WorkspaceTopbar({ view, onChange }: { view: WorkspaceView; onChange: (view: WorkspaceView) => void }) {
  return <header className="dc-workspace-topbar">
    <ViewPicker view={view} onChange={onChange} />
    <WorkspaceClock />
  </header>;
}

export function DesignSystemLauncher({ view, onViewChange }: { view: WorkspaceView; onViewChange: (view: WorkspaceView) => void }) {
  const open = view === "design-system" || view === "scrum";
  const [section, setSection] = useState<Section>("Overview");
  const [anchor, setAnchor] = useState<string | undefined>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [navigationRevision, setNavigationRevision] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [status, setStatus] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLDivElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const keyboard = useKeyboard();
  const hideKeyboard = useRef(keyboard.hide);
  hideKeyboard.current = keyboard.hide;

  function changeView(next: WorkspaceView) {
    keyboard.hide();
    setMenuOpen(false); setQuery("");
    onViewChange(next);
  }
  useEffect(() => {
    if (open && !dialog.current?.open) { hideKeyboard.current(); dialog.current?.showModal(); }
    if (open) dialog.current?.querySelector<HTMLButtonElement>('.dc-workspace-topbar [role="combobox"]')?.focus({ preventScroll: true });
    if (!open && dialog.current?.open) { dialog.current.close(); launcher.current?.querySelector<HTMLButtonElement>('[role="combobox"]')?.focus(); }
  }, [open, view]);
  useEffect(() => {
    const target = anchor ? content.current?.querySelector<HTMLElement>(`#ds-${anchor}`) : null;
    if (target && content.current) content.current.scrollTo({ top: target.getBoundingClientRect().top - content.current.getBoundingClientRect().top + content.current.scrollTop - 24 });
    else content.current?.scrollTo({ top: 0 });
    setStatus("");
  }, [section, anchor, navigationRevision, open]);
  function navigate(next: Section, nextAnchor?: string) {
    setSection(next); setAnchor(nextAnchor); setMenuOpen(false); setQuery("");
    setNavigationRevision(value => value + 1);
    if (menuOpen) window.requestAnimationFrame(() => content.current?.focus());
  }
  const filteredNavigation = navigation.map(group => ({ ...group, items: group.items.filter(item => `${item.label} ${group.title}`.toLowerCase().includes(query.toLowerCase().trim())) })).filter(group => group.items.length);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const startComponent = () => {
    downloadFile(`${APP_FILE_PREFIX}-component-brief.md`, newComponentBrief, "text/markdown");
    setStatus("Component brief downloaded. Use it to define a new reusable component.");
  };

  return createPortal(<>
    <div ref={launcher} className="ds-launcher" hidden={open} onPointerDown={() => keyboard.hide()}><WorkspaceTopbar view={view} onChange={changeView} /></div>
    <dialog ref={dialog} className="ds-workspace" aria-label={view === "scrum" ? `${APP_LABEL} process documentation` : `${APP_LABEL} design system`} lang="en" onCancel={event => { event.preventDefault(); if (menuOpen && window.matchMedia("(max-width: 760px)").matches) { setMenuOpen(false); setQuery(""); menuTrigger.current?.focus(); } else changeView("app"); }}>
      {view === "scrum" && <ScrumWorkspace topbar={<WorkspaceTopbar view={view} onChange={changeView} />} />}
      {view === "design-system" && <>
        <WorkspaceTopbar view={view} onChange={changeView} />
        <div className="ds-mobile-navigation"><button ref={menuTrigger} type="button" aria-expanded={menuOpen} aria-controls="ds-library-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={18} /> : <List size={18} />}Browse library<CaretDown size={13} /></button><span>{section === "Overview" ? "Introduction" : section}</span></div>
        <div className="ds-workspace-body">
          <aside className="ds-sidebar" data-mobile-open={menuOpen}>
            <label className="ds-library-search"><MagnifyingGlass size={16} aria-hidden="true" /><input type="search" aria-label="Find in library" placeholder="Find in library…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Escape" && query) { event.preventDefault(); event.stopPropagation(); setQuery(""); } }} /></label>
            <nav id="ds-library-nav" aria-label="Design system sections">{filteredNavigation.map(group => <div className="ds-nav-group" key={group.title}><span className="ds-sidebar-label">{group.title}</span>{group.items.map(item => <button key={item.label} type="button" aria-current={section === item.section && anchor === item.anchor ? "page" : undefined} onClick={() => navigate(item.section, item.anchor)}>{item.label}</button>)}</div>)}{!filteredNavigation.length && <p className="ds-empty-search" role="status">No matches for “{query}”.</p>}</nav>
            <div className="ds-sidebar-footer"><span className="ds-version"><span />Compact · {APP_VERSION}</span><a href={paperUrl} target="_blank" rel="noreferrer">Paper reference <ArrowSquareOut size={14} /></a></div>
          </aside>
          <main className="ds-main" ref={content} id="ds-main" tabIndex={-1}>
            <div className="ds-document">
            <div className="ds-page-top"><span>{section === "Overview" ? "Foundations / Introduction" : `${section}${anchor ? ` / ${navigation.flatMap(group => group.items).find(item => item.section === section && item.anchor === anchor)?.label ?? ""}` : ""}`}</span><button type="button" className="ds-text-action" onClick={startComponent}><Plus size={16} />New component brief</button></div>
            {section === "Overview" ? <Overview onNavigate={navigate} /> : <>
              <div className="ds-page-heading"><h1>{section}</h1><p>{section === "Foundations" ? "The small decisions that make every screen feel connected." : section === "Components" ? "Reusable pieces. Real states. The same code we use to build." : section === "Patterns" ? "A head start for the next screen, shaped by your Daily and Search frames." : section === "Assets" ? "A small visual kit with clear origins and reusable files." : "A few shared rules, so the system can grow without losing its character."}</p></div>
              {section === "Foundations" && <Foundations onStatus={setStatus} />}
              {section === "Components" && <Components theme={theme} onTheme={setTheme} onStatus={setStatus} />}
              {section === "Patterns" && <Patterns onStatus={setStatus} />}
              {section === "Assets" && <Assets onStatus={setStatus} />}
              {section === "Guidelines" && <Guidelines onNewComponent={startComponent} />}
            </>}
            <footer className="ds-page-footer"><span>{APP_LABEL} · Editorial project by Julio Caggiano</span><span>Monochrome study / September 2026</span></footer>
            <nav className="ds-page-pagination" aria-label="Library pages">{section !== "Overview" && <button type="button" onClick={() => navigate(sections[sections.indexOf(section) - 1])}><ArrowLeft size={16} /><span><small>Previous</small>{sections[sections.indexOf(section) - 1] === "Overview" ? "Introduction" : sections[sections.indexOf(section) - 1]}</span></button>}{section !== "Guidelines" && <button type="button" onClick={() => navigate(sections[sections.indexOf(section) + 1])}><span><small>Next</small>{sections[sections.indexOf(section) + 1]}</span><ArrowRight size={16} /></button>}</nav>
            </div>
          </main>
        </div>
        <div className="ds-notice" role="status" data-visible={Boolean(status)}>{status}</div>
      </>}
    </dialog>
  </>, document.body);
}

function Overview({ onNavigate }: { onNavigate: (section: Section, anchor?: string) => void }) {
  const entries: { title: string; description: string; section: Section; anchor?: string; visual: ReactNode }[] = [
    { title: "Components", description: "Reusable controls, variants, and real states.", section: "Components", visual: <div className="ds-tile-controls"><span>Explore collection <ArrowRight size={14} /></span><span><Heart size={18} /> Save</span><span>Painting</span><span><Check size={14} /> Print</span></div> },
    { title: "Color", description: "Compact light and dark neutral palettes.", section: "Foundations", anchor: "color", visual: <div className="ds-tile-colors">{neutralColors.map(token => <span key={token.key} style={{ background: token.value }} />)}</div> },
    { title: "Typography", description: "Type for artwork, stories, and the interface.", section: "Foundations", anchor: "typography", visual: <div className="ds-tile-type">Aa<span>Culture is a daily practice.</span></div> },
    { title: "Icons", description: "One familiar family for navigation and actions.", section: "Assets", anchor: "icons", visual: <div className="ds-tile-icons">{icons.slice(0, 8).map(({ name, Icon }) => <Icon size={24} key={name} />)}</div> },
    { title: "Patterns", description: "Ready-to-use compositions from Daily and Search.", section: "Patterns", visual: <div className="ds-tile-pattern"><img src="/assets/content/great-wave.jpg" alt="" /><div><span /><span /><span /><span /></div></div> },
    { title: "Compositions", description: "Original, editable assets for the next screen.", section: "Assets", anchor: "ready-made-compositions", visual: <img className="ds-tile-asset" src="/design-system/gallery-mark.svg" alt="" /> },
  ];
  return <>
    <div className="ds-overview-heading"><h1>{APP_LABEL} Design System</h1><p>Quiet controls. Close spacing. The artwork leads.</p></div>
    <div className="ds-overview-grid">{entries.map(item => <button type="button" key={item.title} onClick={() => onNavigate(item.section, item.anchor)}><div className="ds-tile-visual" aria-hidden="true">{item.visual}</div><h2>{item.title}<ArrowRight size={16} /></h2><p>{item.description}</p></button>)}</div>
    <div className="ds-editorial-note"><BookOpen size={22} /><div><h3>Built alongside the product.</h3><p>Start with a real screen. Reuse the library, review the result, and add what is missing. Your Daily and Search frames guide the patterns.</p></div><button type="button" className="ds-text-action" onClick={() => onNavigate("Guidelines")}>Our approach <ArrowRight size={14} /></button></div>
  </>;
}

function SectionHeader({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="ds-section-heading" id={`ds-${sectionId(title)}`}><h2>{title}</h2>{children}</div>;
}

function Foundations({ onStatus }: { onStatus: (message: string) => void }) {
  return <>
    <SectionHeader title="Color"><button type="button" className="ds-text-action" onClick={() => { downloadFile(`${APP_FILE_PREFIX}.tokens.json`, JSON.stringify(tokenDocument, null, 2), "application/json"); onStatus("Design tokens downloaded."); }}><DownloadSimple size={16} />Export tokens</button></SectionHeader>
    <p className="ds-section-copy">Dark for primary content, medium for secondary labels, and light for surfaces. White is the canvas.</p>
    <div className="ds-color-grid">{neutralColors.map(item => <button type="button" key={item.variable} onClick={async () => { try { await navigator.clipboard.writeText(`var(${item.variable})`); onStatus(`Copied ${item.variable}`); } catch { onStatus(`Use var(${item.variable})`); } }}><span className="ds-color-swatch" style={{ background: item.value }} /><strong>{item.name}</strong><span>{item.value}</span><small>{item.variable}</small></button>)}</div>
    <p className="ds-section-copy">Dark mode uses five tones: charcoal canvas, quiet surfaces, raised controls, muted text, and soft white. Glass and shadows reuse these tones with opacity.</p>
    <div className="ds-color-grid">{darkColors.map(item => <button type="button" key={item.key} onClick={async () => { try { await navigator.clipboard.writeText(`var(${item.variable})`); onStatus(`Copied ${item.variable}`); } catch { onStatus(`Use var(${item.variable})`); } }}><span className="ds-color-swatch" style={{ background: item.value }} /><strong>{item.name}</strong><span>{item.value}</span><small>{item.variable} · Dark</small></button>)}</div>
    <SectionHeader title="Typography"><span className="ds-pill-note">PP Neue Montreal · Regular / Medium</span></SectionHeader>
    <p className="ds-section-copy">PP Neue Montreal is used throughout the app and library. The local prototype uses installed fonts. Exact rendering elsewhere needs the same fonts or authorized webfonts.</p>
    <div className="ds-type-table">{typeTokens.map(item => <div key={item.name}><div><strong>{item.name}</strong><span>{item.size}px / {item.lineHeight}px</span></div><p style={{ fontSize: item.size, lineHeight: `${item.lineHeight}px`, fontWeight: item.weight, letterSpacing: item.letterSpacing }}>Culture is a daily practice.</p></div>)}</div>
    <SectionHeader title="Space & shape" />
    <div className="ds-spacing-grid">{compactSpacingTokens.map(item => <div key={item.name}><span className="ds-space-bar" style={{ width: item.value }} /><strong>{item.pixels}px</strong></div>)}</div>
    <div className="ds-rule-columns"><div><h3>Hairline dividers</h3><p>Use a light boundary when a change of spacing is not enough.</p></div><div><h3>4px artwork corners</h3><p>Small corners, proportional images, and 4px gaps between gallery items.</p></div><div><h3>Pill controls</h3><p>Compact pills with 4px gaps. Touch devices expand controls to a 44px target.</p></div></div>
  </>;
}

function Components({ theme, onTheme, onStatus }: { theme: "light" | "dark"; onTheme: (value: "light" | "dark") => void; onStatus: (message: string) => void }) {
  const [variant, setVariant] = useState<"primary" | "secondary" | "ghost">("primary");
  const [filter, setFilter] = useState("All");
  const [checked, setChecked] = useState(true);
  const [likedExamples, setLikedExamples] = useState<Record<number, boolean>>({});
  return <>
    <div className="ds-preview-controls"><span>Preview appearance</span><div>{(["light", "dark"] as const).map(item => <button type="button" key={item} aria-pressed={theme === item} onClick={() => onTheme(item)}>{item === "light" ? "Light" : "Dark"}</button>)}</div></div>
    <SectionHeader title="Buttons" />
    <div className="ds-component-description"><p>Primary for the main action. Secondary for an alternative. Ghost for a quiet action.</p><span>Starter component</span></div>
    <PreviewCode id="buttons" label="Buttons" theme={theme} onStatus={onStatus} code={`${componentImport}\n\n<Button variant="${variant}" onClick={openCollection}>Explore collection</Button>\n<Button variant="${variant}" loading>Explore collection</Button>\n<Button variant="${variant}" disabled>Explore collection</Button>`}>
      <div className="ds-button-examples"><div><Button variant={variant} onClick={() => onStatus("Default button activated.")}>Explore collection</Button><span>Default</span></div><div><Button variant={variant} loading>Explore collection</Button><span>Loading</span></div><div><Button variant={variant} disabled>Explore collection</Button><span>Disabled</span></div></div>
    </PreviewCode>
    <div className="ds-property-row"><span>Variant</span><div>{(["primary", "secondary", "ghost"] as const).map(item => <button type="button" key={item} aria-pressed={variant === item} onClick={() => setVariant(item)}>{item}</button>)}</div><small>Tab to inspect focus. Enter or Space activates.</small></div>
    <SectionHeader title="Like button" />
    <p className="ds-section-copy">Equal-width digits keep counts steady. The pill gently resizes when a digit is added or removed.</p>
    <PreviewCode id="like-button" label="Like button" theme={theme} onStatus={onStatus} code={'import { useState } from "react";\nimport { LikeButton } from "./design-system/LikeButton";\n\nexport function LikeExample() {\n  const [liked, setLiked] = useState(false);\n  return (\n    <LikeButton\n      liked={liked}\n      aria-label="Like artwork"\n      onClick={() => setLiked(value => !value)}\n    >\n      {9 + Number(liked)}\n    </LikeButton>\n  );\n}'}>
      <div className="ds-like-examples">{[0, 9, 24, 99, 999].map(count => <LikeButton key={count} liked={Boolean(likedExamples[count])} aria-label={`Like artwork preview, starting at ${count}`} onClick={() => setLikedExamples(values => ({ ...values, [count]: !values[count] }))}>{(count + Number(Boolean(likedExamples[count]))).toLocaleString("en")}</LikeButton>)}<LikeButton liked={false} disabled aria-label="Like artwork unavailable">24</LikeButton></div>
    </PreviewCode>
    <SectionHeader title="Filter chips" />
    <p className="ds-section-copy">Selection changes appearance and announces its state. In phone flows, place chip rails inside the protected Carousel.</p>
    <PreviewCode id="chips" label="Filter chips" theme={theme} onStatus={onStatus} code={`${componentImport}\n\n<Chip selected={filter === "Print"} onClick={() => setFilter("Print")}>Print</Chip>`}><div className="ds-chip-row">{["All", "Painting", "Print", "Object"].map(item => <Chip selected={item === filter} key={item} onClick={() => setFilter(item)}>{item}</Chip>)}<Chip disabled>Unavailable</Chip></div></PreviewCode>
    <SelectionShowcase theme={theme} onStatus={onStatus} />
    <ArtworkInformationShowcase theme={theme} onStatus={onStatus} />
    <SectionHeader title="Artwork cards" />
    <div className="ds-component-description"><p>Use compact metadata directly below the artwork. Keep titles, creators, and context close together.</p><span><Check size={13} />Shared with the app</span></div>
    <PreviewCode id="artwork-cards" label="Artwork cards" theme={theme} onStatus={onStatus} code={`${componentImport}\n\n<ArtworkCard\n  image="/assets/content/great-wave.jpg"\n  title="The Great Wave off Kanagawa"\n  creator="Katsushika Hokusai"\n  meta="Japan · Print"\n  density="compact"\n  onOpen={openArtwork}\n/>`}><div className="ds-artwork-grid">{sampleArtworks.map(item => <ArtworkCard key={item.title} {...item} density="compact" onOpen={() => onStatus(`Artwork selected: ${item.title}. This library preview does not open the app.`)} />)}</div></PreviewCode>
    <SectionHeader title="Toggle" />
    <div className="ds-component-description"><p>For a setting that takes effect immediately. The state belongs to the screen using it.</p><span><Check size={13} />Shared with the app</span></div>
    <PreviewCode id="toggle" label="Toggle" theme={theme} onStatus={onStatus} code={`${componentImport}\n\n<Toggle\n  ariaLabel="Notifications"\n  checked={enabled}\n  onChange={() => setEnabled(!enabled)}\n/>`}><div className="ds-toggle-example"><span>Notifications preview<small>This example changes only the preview.</small></span><Toggle ariaLabel="Notifications preview" checked={checked} onChange={() => setChecked(!checked)} /></div></PreviewCode>
  </>;
}

function Patterns({ onStatus }: { onStatus: (message: string) => void }) {
  return <>
    <div className="ds-pattern-intro"><span className="ds-pill-note">Compact · Monochrome</span><p>Two compositions based on your Daily and Search frames. The same 4–8px spacing, small controls, and quiet hierarchy.</p></div>
    <div className="ds-pattern-comparison">
      <section className="ds-pattern-entry">
        <SectionHeader title="Daily · A work and its story"><CopyAction label="Copy" onStatus={onStatus} value={'import { DailyStoryPattern } from "./design-system/patterns";\n\n<DailyStoryPattern />'} /></SectionHeader>
        <div className="ds-pattern-canvas dc-system"><DailyStoryPattern /></div>
        <p className="ds-pattern-caption">4px canvas inset · 8px text inset · 14px reading text</p>
      </section>
      <section className="ds-pattern-entry">
        <SectionHeader title="Search · Discovery and a gallery"><CopyAction label="Copy" onStatus={onStatus} value={'import { SearchDiscoveryPattern } from "./design-system/patterns";\n\n<SearchDiscoveryPattern onOpen={(title) => openArtworkByTitle(title)} />'} /></SectionHeader>
        <div className="ds-pattern-canvas dc-system"><SearchDiscoveryPattern onOpen={title => onStatus(`Selected: ${title}. Connect onOpen to a detail screen when reusing.`)} /></div>
        <p className="ds-pattern-caption">4px gallery gaps · 8px group gaps · Compact metadata</p>
      </section>
    </div>
    <p className="ds-fine">Filters, discovery tiles, and save states work in these previews. The search field shows layout. Use the app’s keyboard-aware field when integrating search.</p>
  </>;
}

const icons = (["House", "Shuffle", "MagnifyingGlass", "Plus", "Heart", "GridFour", "List", "SlidersHorizontal", "ArrowRight", "CaretLeft", "CaretRight", "CaretDown", "Check", "CheckCircle", "Share", "DownloadSimple", "UploadSimple", "X", "ImageSquare", "PaperPlaneTilt", "TrashSimple", "GlobeHemisphereWest", "Star", "Sparkle"] as const).map(name => ({ name, Icon: PrototypeIcons[name] }));
function Assets({ onStatus }: { onStatus: (message: string) => void }) {
  return <>
    <SectionHeader title="Icons"><span className="ds-pill-note">Taste</span></SectionHeader>
    <p className="ds-section-copy">Taste’s geometric icons use consistent weight and restrained corners. Hearts keep distinct saved and unsaved states.</p>
    <div className="ds-icons">{icons.map(({ name, Icon }) => <div key={name}><Icon size={26} /><span>{name}</span><CopyAction label="Copy" onStatus={onStatus} value={`import { ${name} } from "./design-system/PrototypeIcons";\n\n<${name} size={24} />`} /></div>)}</div>
    <SectionHeader title="Ready-made compositions"><span className="ds-pill-note">Original · SVG</span></SectionHeader>
    <div className="ds-assets-grid">{systemAssets.map(asset => <article key={asset.id}><div className="ds-asset-preview"><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(asset.svg)}`} alt={asset.name} /></div><h3>{asset.name}</h3><p>{asset.description}</p><button type="button" className="ds-text-action" onClick={() => { downloadFile(`${asset.id}.svg`, asset.svg, "image/svg+xml"); onStatus(`${asset.name} downloaded as an editable SVG.`); }}><DownloadSimple size={16} />Download SVG</button></article>)}</div>
    <SectionHeader title="Artwork & content" />
    <div className="ds-content-sources"><div className="ds-content-thumbs">{sampleArtworks.map(item => <img key={item.title} src={item.image} alt={item.title} />)}</div><div><h3>Use the collection we already have.</h3><p>These previews use existing {APP_LABEL} files. Source and rights notes are recorded with the assets.</p><a href="/assets/content/README.md" target="_blank" rel="noreferrer">Read artwork source notes <ArrowSquareOut size={14} /></a><p className="ds-fine">Rights notes were recorded September 3, 2026. Recheck before distribution. Reference screenshots are kept outside shipped assets.</p></div></div>
  </>;
}

function Guidelines({ onNewComponent }: { onNewComponent: () => void }) {
  return <>
    <div className="ds-guideline-lead"><span>OUR WORKING METHOD</span><h2>Prototype. Extract.<br />Use again. Refine.</h2><p>Build enough system to make the next screen consistent. Improve the system through real product work.</p></div>
    <div className="ds-guideline-steps">{[{ title: "Start with a real need", body: "Use a screen or flow to define what is missing. Check the existing library before adding a component." }, { title: "Compose before creating", body: "Reuse an existing component or add a variant. Keep screen-specific arrangements as patterns." }, { title: "Review the whole experience", body: "Check focus, touch, loading, errors, long labels, themes, and mobile behavior. Generated UI still needs human review." }, { title: "Record the decision", body: "Name the component, show its states, and explain when to use it. Add its working example here." }].map((item, index) => <div key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div>
    <SectionHeader title="What comes from where" />
    <div className="ds-source-rows"><div><h3>Vercel Geist</h3><p>The library framing: grouped navigation, compact headings, bordered previews, and code beside examples.</p></div><div><h3>Artsy</h3><p>Neutral surfaces, regular sans-serif type, pill controls and proportional artwork. The current study uses no chromatic UI accent.</p></div><div><h3>Your Paper frames</h3><p>Artwork-first Daily, compact metadata, collection-led Search, discovery tiles, and gallery composition.</p></div><div><h3>{APP_LABEL}</h3><p>Editorial voice, stories, chronology, saved work, locales, contribution drafts, and the existing mobile behavior.</p></div></div>
    <div className="ds-editorial-note"><BookOpen size={23} /><div><h3>Compact, with room to read.</h3><p>Your Paper frames set the density: 4–8px gaps, thin dividers, and closely grouped metadata. This variation uses 11px chip labels and 14px reading text. Color belongs to the artwork.</p></div></div>
    <SectionHeader title="A clear starting point for the next component" />
    <p className="ds-section-copy">The downloadable brief covers purpose, reuse, states, content, and review. Creating a component means adding reusable code and an example here.</p>
    <div className="dc-system"><Button variant="secondary" onClick={onNewComponent}><Plus size={16} />Download component brief</Button></div>
    <SectionHeader title="Research behind the workflow" />
    <div className="ds-research-links"><a href="https://www.figma.com/blog/the-tldr-on-mcp/" target="_blank" rel="noreferrer"><span>Q2 · April 15, 2026</span>Give AI structured design context<ArrowSquareOut size={16} /></a><a href="https://storybook.js.org/blog/storybook-10-4/" target="_blank" rel="noreferrer"><span>Q2 · May 18, 2026</span>Review components and their states<ArrowSquareOut size={16} /></a><a href="https://www.figma.com/blog/the-benefits-of-code-connect-in-mcp/" target="_blank" rel="noreferrer"><span>Q3 · August 5, 2026</span>Connect designs to real components<ArrowSquareOut size={16} /></a></div>
    <p className="ds-fine">Our recommendation uses these sources and the current stage of {APP_LABEL}. Vendor results are not a promise of speed or quality. Paper and code do not synchronize automatically.</p>
  </>;
}
