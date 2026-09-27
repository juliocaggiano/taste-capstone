# Taste (V1.2) design system

## Search controls and shared artwork lists — 2026-09-23

- Expanded Home search has the normal Search glyph on the left and an **X on the right to close**. A localized **Clear** text action appears only with a query, preserving distinct clearing and dismissal. Coarse-pointer targets remain44px high and at least44px wide.
- Gallery, Artists and Accounts reserve the same heading-row height: **32px fine /44px coarse**. Keep centered title alignment; conditional Filters/view controls must not shift titles or result counts between scopes.
- Search/Home List, Library Artworks List and collection contents use **ArtworkListRow**. Shared geometry: **64px 3:2 image**,2px image corners,16px column gap,8px vertical/4px horizontal padding,60px minimum row height and thin dividers. Title uses13/16px at500; author and artwork date share the second line in `--app-muted`. Large text uses14/18px consistently.
- Keep grids, artwork rails, people lists and historical comparison-study layouts distinct. Shared list navigation preserves existing artwork detail/return behavior. Do not duplicate row CSS in individual screens.
- Sources: `app/src/ArtworkListRow.tsx`, `app/src/artwork-list-row.css`, `app/src/Prototype.tsx`, `app/src/discover.css`, `app/src/home-search-surface.css`. Evidence: `qa/search-list-consistency-2026-09-23/verification.md`.


## Home search aligned with Search — 2026-09-23

- Julio rejected the oversized Home search field and separate suggestion-list treatment. Normal Home search now reuses `DiscoverScreen`: the same compact field, Artworks / Artists / Accounts / Medium selection, Gallery, Filters, grid/list views and empty states as bottom-menu Search. This supersedes the Home search refinement dimensions and Cancel treatment below.
- Use the shared **32px** field on fine pointers and **44px** on coarse pointers, with **14/20px** text and **12px** side insets. Keep the existing closed Home Search icon unchanged. The Search glyph sits on the left; the right X closes search. A separate Clear text action appears with a query.
- Preserve the **320ms leftward reveal** and a restrained gallery entrance. Reduced motion removes movement. The opaque Home surface and sticky search controls keep artwork from showing through gaps. Its field starts at **64px on iPhone / 68px on Pixel**; the scrolling content clears the keyboard once and reserves the protected bottom region.
- Home search and Daily remain mounted under artwork, artist and account details. Retain query, category, sorting, medium, layout, result scroll and opening-control focus. Closing search returns to Daily's prior edition and reading position. Home and bottom-menu Search have independent browse state.
- Reuse the shared Filters sheet and result components. Let MobileScroll suppress drag clicks before recording navigation focus. Preserve clear, Escape, keyboard navigation, four locales and theme tokens. The explicit `inline`, `focus` and `sheet` study routes retain the earlier designs for comparison.
- Sources: `app/src/HomeSearchSurface.tsx`, `app/src/home-search-surface.css`, shared `DiscoverScreen` in `app/src/Prototype.tsx`. Evidence: `qa/home-search-shared-2026-09-23/verification.md`. Local implementation is ready for visual review.


## Home search refinement — 2026-09-23

- Preserve Home's **320ms leftward search-bar expansion**. The default remains `inline`, with a **44px** field, **8px** side insets, and width based on the current device. Its top is `max(60px, device safe-area top) + 8px`. This supersedes the earlier 32px field and capped results panel.
- Use a connected, opaque overlay across nearly the full usable screen. A separate full-screen backdrop sits below the keyboard and phone chrome, covering image slivers above and below the overlay. Keep a **12px** field-to-results gap; results scroll independently through the remaining height.
- The search portals to the full phone screen. Reserve **34px on iPhone / 48px on Pixel** when the keyboard is closed, and clear the keyboard while open. Deduct its height once. Keep the protected mobile runtime unchanged.
- Show localized **Cancel** text to close search and an **X** to clear the query. Fresh opening focuses the field. Returning from artwork restores the query, result focus, and previous scroll clamped to the available range, with the keyboard closed. Preserve Home's edition and reading position; its query remains independent from bottom-menu Search.
- Retain the original `inline`, `focus`, and `sheet` search-study variants. Reduced motion removes movement. Sources: `app/src/TodaySearch.tsx` and `app/src/today-search.css`; verification record: `qa/home-search-refinement-2026-09-23/verification.md`. Build, 12 browser scenarios, and four-locale fit checks passed; see the verification record.

## Home date and tag sizing — 2026-09-23

- Use **Save** as the typography reference. Home's actual date (`time.today-date`) now uses **10/12px** text inside its existing **22px** control. Detail art-form labels keep **12/14px** text.
- Shared Home and artwork-detail tags keep **10/12px** text, with **5px vertical / 8px horizontal padding**. Single-line tags are **22px** high, matching Save and the date control. Preserve wrapping and existing corners.
- Source: `app/src/prototype.css`. This supersedes earlier Home date typography and tag-padding values below.

## Selected bottom edge blur — 2026-09-23

- Julio selected **Stronger, bottom only** as the normal app default. Use a **144px** bottom zone with progressively masked **3/6/12px** backdrop blur layers. The normal app has no top edge blur.
- Edge intensity follows the last **28px** of available scroll. The bottom fades away at the end and disappears without overflow. Stationary app-owned layers pass pointer input through. Keep phone chrome, floating navigation, scrollbar, gestures, and protected runtime unchanged. Hide layers for keyboard, full-screen viewer, dialogs, Home search, Create, and an open inline Choose folder menu.
- The original Current, Subtle, and Stronger comparison remains at `http://127.0.0.1:4173/edge-blur-study.html`. Explicit `edge-blur-study=off|soft|strong` keeps the original **both-edge** comparison: Subtle uses 104px with 1.5/3/6px layers; Stronger uses 144px with 3/6/12px layers. Its top fades away at the beginning; both disappear without overflow. Page/theme/scroll commands stay isolated to study routes.
- Normal saves, folders, notes, preferences, follows, and Create drafts keep their existing persistence. Study changes remain temporary. Use semantic canvas colors in both themes. Reduced motion removes edge transitions and comparison scroll animation; reduced transparency removes backdrop blur.
- Source: `app/src/ScrollEdgeStudy.tsx`, `app/src/scroll-edge-study.css`, `app/src/Prototype.tsx`, and `app/public/edge-blur-study.html`. Evidence and limitations: `qa/scroll-edge-blur-2026-09-23/verification.md`. The selected bottom-only integration passed build and focused browser checks; see the verification addendum.


## Home header icon proportions — 2026-09-23

- Home Shuffle/Search SVGs are now **10px**. Julio found 14px too large and 8px too small; this slight increase supersedes the 8px trial. Keep 22px visible circles, current hit areas, original shapes, and all surrounding geometry. Expand is unchanged. This supersedes the 14px Home Search/Shuffle glyph size below. Verified local build and preview: `qa/home-header-glyphs-2026-09-23/verification.md`.

## Favorites gallery controls — 2026-09-23

- Library → Artworks shares Explore's Filters, Grid, and List actions through `app/src/GalleryControls.tsx`. Sort by Featured or title in either direction; filter by Medium, with Reset filters and Done. All labels support four locales.
- Preserve two-column grid, 4px gaps, 8px side gutters, portrait cap, and existing grid typography. List uses equal 64 × 64px cover crops, recorded focal positions, and 12/16px text with the Large-text override.
- Keep Artworks filters and layout independent from Folders. Retain them when opening/closing artwork details or switching between Artworks and Folders. Filtered empty results offer Reset filters and an accurate count.
- Verified build, protected runtime, iPhone/Pixel layout, sort/filter/reset, detail return, Folders isolation, and Explore shared controls. Evidence: `qa/favorites-gallery-controls-2026-09-23/verification.md`. Visual approval pending.

## Library artwork grid and Home icon trial — 2026-09-23

- Library **Artworks** now follows Explore gallery styling with two equal columns, 4px gaps, natural image heights capped at 125% of column width, and title/creator captions at 10/12px. Artworks now uses the shared 8px Explore side insets, with full-width tabs. Preserve Large text adaptation. Folders keep their prior design and 20px insets. Scope: `data-library-section="pieces"` in `Prototype.tsx` and `prototype.css`.
- Floating-menu Home now trials a local house with roof overhangs and a narrower body in `NavigationIcon.tsx`; selected uses a stroke-free fill, inactive uses 1.75px outline. Preserve 20px icon, 44px target, glass and selection motion. This supersedes the lower-roof menu glyph for local review; shared House glyph stays unchanged.
- Checks: `qa/library-grid-home-icon-2026-09-23/verification.md`. Build, protected runtime, iPhone/Pixel dimensions, and Folders preservation verified; visual approval pending.


## Explore Gallery refinement — 2026-09-23

- Normal Explore now omits Collections. Search, Discover something new, Gallery, then Explore by category remain in that order. Saved study routes retain their original layouts.
- Gallery previews six artworks. A centered **Show all** pill below the preview opens the complete Gallery with Back, grid/list controls, and Sort & Filter. Back restores the preview scroll/focus; artwork detail retains the expanded view and filters.
- Sort & Filter uses the shared sheet: Featured, Title A–Z, Title Z–A, and Medium, with Reset filters and Done. New category or primary search-scope selection clears the extra Gallery medium constraint. No Show all action appears for zero results or when the preview already contains every result.
- List images use equal **64 × 64px cover crops**, preserving recorded focal positions. Grid retains three columns and the existing portrait cap. Typography, category cards, themes and protected phone runtime stay shared.
- Source: `app/src/Prototype.tsx` and `app/src/discover.css`. Verification: `qa/gallery-expansion-2026-09-23/verification.md`.


## Home control readability — 2026-09-23

Home's compact controls are 2px larger: 22px Date, Search, Shuffle, Save, count/avatars, and Expand surfaces. Save/count labels use 10/12px, date 12/14px, Last edited 12/12px, and Search/Shuffle glyphs 14px. Keep the original Search/Expand shapes. Technical information and creator-card headings use 16/20px, with 14/18px default details/body. The Daily top-row-to-image gap is 10px, up from 8px; title-to-creator remains 1px. These values supersede earlier measurements below. Noh Mask's visible category is Theater. [Verification](../qa/home-control-scale-2026-09-23/verification.md).

## Selected Explore layout — Compact browse, 2026-09-23

- Julio rejected the six later experiments and selected the earlier **Compact browse**. It is now the normal Explore layout: Search → Discover something new → Gallery → compact collection cover shelf → Explore by category.
- Reuse the preserved Compact browse component, exact card sizing, typography, spacing, and shared Search/category behavior. Keep the three-column Gallery and portrait cap.
- `DiscoverScreen` defaults its local visual variant to `compact-browse`. The root study flag remains null on the normal route, so ordinary preferences and saves retain their normal persistence. Explicit study queries remain temporary; the saved first-round comparison remains `/explore-saved.html`.
- This selection supersedes the second- and third-round experiment directions below. Verification: `qa/compact-browse-selected-2026-09-23/verification.md`.

## Reading typography trial — 2026-09-23

The live Home and shared artwork detail now use 16/18px title and creator text, 14/16px description text, and 10/12px category labels. These fonts are each 2px larger than the prior live defaults. Category pills are 16px high with unchanged 2px 6px padding. The single-line title-to-creator gap is 1px, down from 2px. Action controls and other reading gaps remain unchanged. These trial values supersede the older live Today measurements below; historical Paper reference values remain reference evidence. General design-system typography roles are unchanged. [Verification](../qa/reading-type-2026-09-23/verification.md).

## Compact Explore concepts, third round — 2026-09-23

- Julio rejected the second-round magazine, room, and index options. Both their typography and layouts felt outside Taste's design system. Do not treat them as the active direction. Compact browse remains the preferred saved baseline, not the default.
- `http://127.0.0.1:4173/explore-study.html` now compares **Gallery & collections** (`switchboard`), **Collection filters** (`lenses`), and **Connected gallery** (`stream`). The first switches between Gallery and Collections with shared underlined tabs; the second filters Gallery in place using compact collection covers; the third places compact collection links between groups of artworks.
- Use established 16/20 regular section labels, 12/16 controls and collection titles, compact metadata, shared semantic colors, three-column Gallery crops and spacing. No editorial mastheads, exhibition-wall compositions, large concept headlines, or enlarged promotional cards in these options.
- Keep Search, Categories at the end, normal app behavior, and the saved Compact browse design. New concepts retain their local choice during category/search filtering and artwork/collection overlays. The first-round comparison remains `/explore-saved.html`; all previous direct study routes remain available.
- New sources: `ExploreSwitchboard.tsx`, `ExploreLenses.tsx`, `ExploreStream.tsx` and their scoped styles. Handoff: `qa/explore-compact-concepts-2026-09-23/verification.md`. These are new experiments for review, not selected defaults.

## Home and shuffle icons — 2026-09-23

The shared Home glyph now has a lower roof, continuous walls, and a clear doorway. Outline and filled states share the same contour. The bottom menu retains 20px icons, 44px targets, and its existing opacity activation. The icon catalogue also includes the new original Shuffle glyph.

Daily's top-left Shuffle artwork control chooses another featured edition with a 180ms opacity fade. It preserves edition dates, chronological navigation, and destination focus. Reduced motion removes the fade and press scale. Use the existing neutral control surface, a 12px glyph, and a 20px visible circle; coarse pointers receive a 44px target. Keep Home Search and Expand unchanged. This request supersedes the historical no-shuffle direction. Verification: `../qa/home-shuffle-2026-09-23/verification.md`.

## Explore concepts, second round — 2026-09-23

- Julio found the first three layouts too similar to the existing Explore page. **Compact browse** is his favorite so far and remains preserved, not installed as the default. The first-round comparison is now `http://127.0.0.1:4173/explore-saved.html`, initially showing Compact browse on narrow screens. Its direct `?explore-study=compact-browse` route is unchanged.
- The new comparison at `http://127.0.0.1:4173/explore-study.html` offers **The edit** (`editorial`), a visual magazine with collection features and asymmetric artwork pairs; **Collection rooms** (`rooms`), an in-place collection selector and exhibition wall; and **Open index** (`index`), a numbered accordion with artwork previews. Each includes expandable access to the full Gallery.
- Preserve Search, its filters and interactions, category cards at the end, the shared three-column Gallery, real records and actual counts. New conceptual headings deliberately use 26–32px type to create a clearer editorial hierarchy. These sizes are scoped to the experiments, not new global typography rules.
- Study state stays temporary. The default prototype stays unchanged. Keep all six study IDs valid, inherited detail/back behavior, local selection while details cover Explore, four locales, semantic Light/Dark colors, reduced motion, and protected mobile runtime.
- Sources: `app/src/ExploreEditorial.tsx`, `ExploreRooms.tsx`, `ExploreIndex.tsx`, their scoped styles, and `explore-concepts.ts`. Comparison controls are Top / Categories / Reset and Light / Dark. Verification and rationale: `qa/explore-concepts-2026-09-23/verification.md`. No new direction has visual approval yet.

## Explore variations — 2026-09-23

- Julio requested three variations of Explore, changing Collections and Gallery placement. Keep the accepted Search field/filters, three-column Gallery image geometry, and Explore by category design. Categories remain the final section in every variation. No variation has been selected as the new default.
- Compare at `http://127.0.0.1:4173/explore-study.html`: **Gallery first** uses Gallery → collection rows → shortcuts; **Collections first** uses paired-image collection rail → Gallery → shortcuts; **Compact browse** uses shortcuts → Gallery → collection cover shelf. Search precedes and Categories follows each sequence. Query: `?explore-study=gallery-first|collections-first|compact-browse`.
- All previews use real existing collections, works, localized text and actual counts. Collection/artwork navigation keeps existing return behavior. Study preferences, saves, saved artists, people follows, folder metadata and notes stay temporary. Preserve the normal prototype's default layout until Julio chooses.
- Comparison page has responsive tabs/columns, Light/Dark, Top/Gallery/Collections/Categories/Reset, and full-size links. Sources: `app/src/ExploreCollections.tsx`, `app/src/explore-study.css`, `app/src/Prototype.tsx`, and `app/public/explore-study.html`. Handoff: `qa/explore-study-2026-09-23/verification.md`.
- Settings: retain only Theme's bottom divider above About Taste. `.settings-secondary-menu` uses the latest 54px margin and transparent 1px top border, leaving only one visible divider.


Updated: September 23, 2026. Current public app version: **Taste (V1.2)**. Compact monochrome foundations continue; historical v0.2 measurements remain reference evidence. Consult each verification record for completed checks. Visual approval remains Julio's decision.

This system supports the working prototype. It does not represent a complete app migration or Julio's visual approval.

**Settings section spacing, September 23:** Use a 54px gap between the final Theme preference row and the **Other** group. Its heading shares the Settings heading’s 16px/20px regular style, with an 8px gap before the first row. Preserve row heights and the About Taste, Rate App, Legal order.

**Explore shortcut typography, September 23:** The four discovery tiles use 12px/16px category labels and 14px/18px titles, each 2px larger. Keep the existing 72px minimum card height, 12px insets, 8px grid gaps, and 4px corners. Build and live preview checks passed; all four English cards remain 72px tall without overflow. [Visual check](../qa/explore-shortcut-type-2026-09-23.png).

**Profile header actions, September 23:** Use 15px/20px username text and an outlined Share profile action below it for the current reader. Reuse Settings' native sharing, clipboard fallback, and feedback. On other local sample profiles, show the existing Follow/Following control. Use 12px action spacing, 4px corners, and 44px coarse-pointer targets. Search account identities and the owner's Following list open a retained profile layer with Back/Escape and source-focus restoration. Sample profiles keep explicit empty content and sample identification; they do not inherit the owner's saves, folders, or Following list. The only displayed incoming follower edge is the current reader's local follow.

**Latest profile compaction, September 23:** Profile uses a 56px portrait with 8px corners, also applied to the Settings account portrait. Keep 12px beneath the header action, 64px stats, shared 8px content gutters, and 12px above the artwork/folder grid. Profile folder covers use 4px corners, reduced from 12px after review. Remove repeated tab headings; keep a selected folder’s actual name. The underline slides over 260ms and tab content fades over 180ms, with no initial animation and immediate reduced-motion updates. Settings account cards use a 12px inner inset, 14px/20px saved-artwork/folder count subtitle, 8px corners, and 4px action-button corners. Preserve counts, keyboard focus, and folder/artwork return. [Verification](../qa/account-folders-refinement-2026-09-23/verification.md).

**Latest icon/spacing correction, September 23:** The selected Light glass menu uses 20px for every glyph, including the profile, with unchanged 44px targets. Home’s Technical information → creator card gap is 20px, up from 16px.

**Latest account and folder refinement, September 23:** Settings uses two equal account actions with an 8px gap and right-aligned row chevrons. The bottom menu uses the shared geometric user glyph. Profile statistics blend with the page; the selected tab has a thin underline. The username sits beneath the name and the gear is removed. Use two columns of 4:5 artwork images and two columns of rounded folder covers with names/counts. The fuller New folder sheet keeps a header Create action, cover choice, 50-character name, privacy/visibility switches, and sample collaborator selection. Keep the existing portrait, monochrome themes, keyboard-safe shared sheet, 44px touch targets, and protected runtime. This supersedes the earlier black stats band, profile list/circles, menu photo, and single View profile action. [Handoff](../qa/account-folders-refinement-2026-09-23/verification.md).

**Profile and Settings, September 23:** Settings begins with a pale account card containing Julio's portrait, name, live saved-artwork/folder counts, and View profile. One Settings heading introduces existing controls. The final rows are About Taste with Version 1.2, Rate App without a leading icon, and Legal last. The profile screen uses a centered identity and full-width four-part stats bar. Its Artworks, Folders, Following, and Followers sections use actual local saves, personal folders, and followed sample people. There are no inbound followers in this preview, so Followers is zero with an empty state; its component accepts future follower data. Keep 20px settings/list insets, semantic light/dark colors, PP Neue Montreal, existing artwork detail/Edit, 44px navigation targets, focus return, and protected phone chrome. [Handoff and verification](../qa/profile-settings-2026-09-23/verification.md).

**Saved-reference Library, September 23:** Julio selected **Artworks / Folders**. Use a two-tab header, 20px content gutters, circular 92px folder covers, and a two-column artwork grid. Artworks includes every globally saved work; folders reuse the existing multi-membership board state under localized labels. Opening a work uses Home's reading detail. Library-origin details show **Edit** at the top right for folder membership and a private note; Back restores the retained Library view. Keep canonical artwork data, save actions, full-screen viewer, PP Neue Montreal, theme tokens, protected device chrome, and keyboard behavior. The consistent thumbnail crop is a deliberate adaptation of the supplied staggered-image reference. The old Favourites Pieces/Creators/Places tabs are superseded. [Handoff and verification](../qa/library-redesign-2026-09-23/verification.md).

**Search scopes and compact refinements, September 23:** This update supersedes the older query-only Search filters and 24px menu avatar.

- Search section headings, including **Collections**, **Discover something new**, and **Gallery**, match Home's **Check out more**: PP Neue Montreal, **16px / 20px**, weight **400**, zero tracking. Gallery uses **three equal responsive columns** with 4px gaps. Images retain natural proportions up to a responsive 4:5 portrait cap, then crop around the recorded focal position; list thumbnails remain 64 × 64px. Source: `app/src/discover.css`. [Verification record](../qa/gallery-three-columns-2026-09-23/verification.md).
- **Explore by category** uses Architecture, Sculpture, Painting, Music, Literature, Theater, and Cinema. Keep Medium as its separate existing filter system. Category cards form two equal responsive columns, use a **6:7** portrait ratio, **8px** gaps and **4px** corners. Position the compact **16px/20px** label **10px** from the top and left, with **5px/8px** padding and semantic canvas/text colors. Category crops retain known focal points. Independent category covers are documented in `app/public/assets/categories/README.md`; they do not import held editorial entries. Empty categories retain Back/Escape and restore focus and scroll.
- Always show **Artworks / Artists / Accounts / Medium**. Artist results open existing profiles and use **Save / Saved**. Account results reuse the 65 fictional sample profiles, identify them as **Sample profiles**, and keep **Follow / Following** for social connections.
- Only **Medium** opens the secondary All/media selector. Combine its selection with typed text, preserving the medium when the query changes or clears. Switching the primary scope clears hidden medium/shortcut filters. Omit **Show all** when the current scope has zero results.
- Keep shared Search gutters, compact fields, keyboard behavior, and return navigation. Search content keeps **64px** top padding, increased from 56px. Julio reverted the extra 2px below the field, restoring the primary-selector gap to **8px**; the secondary Medium gap stays 8px. Preserve Home's independent search. Artist/account rows reuse semantic colors, PP Neue Montreal, circular identities, and shared save/follow controls.
- Show localized **Unknown** for unknown makers through `localizePiece`; English library examples match. Keep canonical records and IDs. Use localized **Choose folder / New folder / My folder** wording while retaining custom folder names, contents, and storage keys.
- The menu profile image is **20 × 20px**, with no border, outline, or shadow ring in either theme. Keep the **44 × 44px** menu target and selection circle, portrait/initials behavior, and other avatar sizes.

Sources: `app/src/Prototype.tsx`, `app/src/SearchEntities.tsx`, `app/src/search-entities.css`, `app/src/discover.css`, `app/src/today-savers.css`, `app/src/today-boards.ts`, and `app/src/design-system/patterns.tsx`. See the [implementation and verification record](../qa/search-entities-refinement-2026-09-23/verification.md) for completed checks. Visual approval remains Julio's decision.

**Save artists, September 23:** Artist biography cards, artist profiles, and the design-system showcase use **Save / Saved**, superseding artist Follow / Following wording. Visible labels, accessible names, and removal actions are localized in English, Portuguese, Italian, and Spanish. Preserve the existing creator persistence and interaction behavior for compatibility. Social people in the saved-by sheet retain **Follow / Following** and their separate persistence.

**Search return navigation, September 23:** Shortcut/category galleries now show a localized Back arrow and section title. Back or Escape restores the source position and focus. Discover and collections remain mounted but hidden/inert beneath artworks, so artwork → collection → Search returns one level at a time. Queries and field filters remain intact on return. [Verification](../qa/dark-system-2026-09-23/verification.md).

**Charcoal dark theme, September 23:** Julio liked the darker direction inspired by his reminder screenshot and requested more transparent menu glass, with Savee as an additional reference. Keep five neutral tones: `#171717` canvas, `#262626` surface, `#333333` raised surface/divider, `#a3a3a3` muted text, and `#f2f2f2` primary text. Selected capsules use the canvas tone on the surface tone. The menu now uses the surface at 72% opacity, superseding 82%, with unchanged 16px blur, 8% soft-white border, and 4% inset highlight. Inactive menu icons use soft white at 70% opacity for readability through the glass; the selected circle is dark with a full-opacity soft-white icon. These opacity effects do not add solid palette swatches. Shared source tokens, generated exports, and library colors use the same values. The full-screen artwork viewer keeps its image-specific black/white glass; protected device chrome retains its native appearance. Initial build and focused checks passed in the [dark-theme handoff](../qa/dark-system-2026-09-23/verification.md). The [latest glass refinement](../qa/menu-glass-refinement-2026-09-23/verification.md) awaits Julio’s visual review.

**Compact menu edge spacing, September 23:** In both themes, the selected Light glass menu keeps its 248 × 52px size and five fixed 44 × 44px targets. A 3px internal inset plus the 1px border gives the selection circle equal 4px visible gaps at the capsule ends and above/below it. Remaining horizontal space sits between targets, keeping the icons and moving circle aligned. Preserve the existing selection animation and reduced-motion behavior. The correction is scoped to the default `light` variant; legacy solid/outline study layouts remain unchanged. [Handoff](../qa/menu-glass-refinement-2026-09-23/verification.md).

**Page gutters, September 23:** Home, artwork details, and Search share an 8px outer gutter. Search gains 4px per side; its existing 4px nested field/heading insets now align with Home’s 12px reading edge. Library, Settings, Create, collections, and creator reading retain their roomier 20px layout. Creator imagery remains full width. Source token: `--app-page-gutter`. [Verification](../qa/page-gutters-2026-09-23/verification.md).

**Bottom-menu Search refinement, September 23:** The merged Search/Discover page removes the small upper art-form chip rail. Its larger All / Places / Art forms / Creators selector appears only with a query. Keep category tiles, browse shortcuts, and Show all. The search field grows from 24px to 32px for fine pointers, with 14/20 text, 16px search/clear icons, and a 24px clear target. Coarse pointers use 44px for both field and clear target; typing keeps the field height stable. Text changes reset browse-only art-form and shortcut filters; Clear resets the query and all filters. This update is scoped to bottom-menu Search/Discover. Today's expandable search and Home search icon keep their existing design. Build and focused interaction checks passed; visual approval remains Julio’s decision. [Handoff](../qa/discover-search-2026-09-23/verification.md).

**Artwork details aligned with Home, September 23:** Opened artworks reuse Home's reading component and its 420px hero, PP Neue Montreal, compact title/actions, creator/date, categories, story, Last edited, Technical information, and creator panel. Keep the 56px section gap. A pale Back circle replaces Home's top controls: 32px normally, 44px on coarse pointers, with a 14px chevron. The right-side 20px pale label shows the actual art form. Details omit the brand masthead, tagline, and current Daily date. Save, boards, people, and full-screen viewing share the existing functional controls. Returning preserves the underlying Daily position and search query. Details retain no related rail; Home retains Gallery rail. This implementation awaits Julio's review. [Handoff and verification](../qa/artwork-detail-home-2026-09-23/verification.md).

**Prototype icon refinement, September 23:** Julio requested subtle Cursor-inspired refinements across the prototype, preserving the exact homepage Search and Expand icons. `PrototypeIcons.tsx` supplies the original shared geometric glyphs for navigation and actions. The icon catalog uses the same components and copyable imports. This adapts the consistent geometry, restrained corners, natural proportions, and filled details described in [the Cursor designer's construction notes](https://www.minoradventures.co/blog/the-making-of-cursors-icons); no Cursor artwork or fonts are bundled. Keep current control sizes, colors, selected states, and motion. Leave the top Search's 12px Phosphor magnifier and Expand's Paper path unchanged, each in its existing 20px control. Keep avatars as photos/initials, retain the animated Follow and selection checks, and preserve protected device icons. Process documentation retains its independently selected mix. [Verification and handoff](../qa/prototype-icons-2026-09-23/verification.md).

**Selected Gallery rail, September 23:** Julio selected Gallery rail as Today's default Check out more layout. It uses unboxed 208 × 156px images, compact captions, and a 12px rail gap, preserving existing content and navigation. Keep the shared 56px gap for both Last edited → Technical information and creator card → Check out more. Paired grid and Compact list remain available with Gallery rail in the [interactive study](http://127.0.0.1:4173/related-study.html). This selection supersedes the earlier filled cards. [Measurements and verification](../qa/related-works-2026-09-23/verification.md).

**Today search exploration and avatars, September 23:** Profile pictures now use an available photo or two initials, including the current sample reader and Settings menu. The silhouette fallback is removed. Today's Search owns a separate local query and retains the Daily edition and reading scroll beneath results and artwork details. Compare **Expand in place**, **Focus view**, and **Search sheet** at the [interactive study](http://127.0.0.1:4173/search-study.html). The first is the provisional working default; Julio has not selected a final variation. The compact search field expands over 320ms, with soft gray focus and reduced-motion support. Both Today and Discover avoid the earlier black search-field stroke. [Implementation and verification](../qa/today-search-2026-09-23/verification.md).

**Saved-by sheet, count motion, and reading gaps, September 23:** The two avatars and `+count` open one phone-scoped people sheet. Neutral monograms represent fictional sample profiles; the current reader appears first after saving. Follow uses the shared control and separate local people-follow persistence. Changed digits roll upward for Save and downward for unsave over 240ms; unchanged digits and the plus stay still. Reduced motion updates immediately. Keep the 20px controls and 8/10 text. The latest default reading gaps are 2px title → creator, 24px final paragraph → Last edited, and 56px Last edited → Technical information. Last edited uses the existing medium tone at 60% opacity. These values supersede the older reading and red-circle notes. [Implementation and checks](../qa/today-savers-motion-2026-09-23/verification.md).

**Selected menu and Today actions, September 23:** Julio selected the compact Light glass menu as the app default: 248 × 52px, 78%-opacity light surface, 16px blur, and 44px-high navigation targets. Its latest rim uses 24%-opacity white border and 18%-opacity inset highlight. The alternative menus remain in the [study](../qa/floating-menu-2026-09-23/verification.md). Today's title actions follow the structure of [Paper node 1TC-0](../qa/today-actions-paper-2026-09-23/verification.md): two profile avatars and `+count`, a text-only Save/board pill, and a separate circle with Paper's diagonal `open_in_full` glyph. The controls stay 20px high with 8px group gaps. The `+count` and Save/Saved labels now share 8px/10px typography; the count uses proportional numerals without extra tracking. The expand glyph stays about 5px inside its unchanged 20px circle. The pale action surfaces remain limited to the Today control group. Existing saved state, boards, viewer, content, and Daily gestures stay intact.

**Taste naming and Process refinement, September 23:** Use **Taste (V1.2)** across the current interface, localized copy, accessible labels, browser titles, library examples, and downloadable content. `app/src/brand.ts` owns shared brand values. Preserve internal keys, CSS prefixes, paths, source filenames, service labels, and historical evidence. Existing selections, favourites, follows, and task edits remain independent of this display rename.

Process documentation removes Export/Import controls, makes **Sprint name** editable, and removes the plan date/status subtitle. **References · previous sprints** displays completed-task story-point totals from earlier closed sprints. Reflection moves out of planning into an optional separate **Retrospective** for closed sprints and after completion. **Complete sprint** still completes immediately; cancelling the retrospective does not undo it. Legacy data validation and local storage remain intact.

Process micro-interactions use the installed Motion library: search focus and clear control 150ms, view crossfade 180ms, active tab underline 250ms, and dialogs 200ms. Keep motion restrained, inputs usable, exiting panels inert, 4–8px corners, monochrome focus, and reduced-motion support. The selected creator Slide back interaction retains its separate 320ms timing. Current implementation and verification record: [Taste refinement](../qa/taste-refinement-2026-09-23/verification.md). This handoff does not itself claim browser verification.

**Creator profiles and navigation, September 22:** Creator profiles use the supplied reference's artwork hero, prominent identity, single Follow control, and three equal tabs: Overview, Biography, Artworks. At 393px: hero height 275px with no side gutters; identity 28/32; prose 16/26; reading insets 20px; artwork cards 214px square with 20px gaps. `creator-profile.css` scopes the layout, including dark mode and reader sizes. Preserve verified records, actual counts, shared follow state, keyboard tabs, sorting, and saved-work filters. Latest correction removes Share and uses a 104 × 32px minimum Follow control with 4px corners, dark Follow and outlined Following states, and 44px coarse-pointer height. Back has a 24px visible square and 16px chevron inside its 44px target. Cards show title, then creator/year in normal case without the medium label. The tab underline is a single 1px line that slides over 260ms; reduced motion disables the transition. [Latest refinement checks](../qa/creator-refinement-2026-09-22/verification.md). Do not introduce sales data, follower counts, or the reference's overlay avatars. The menu correction replaces rounded icons and bounce with 24px conventional symbols, 1.5px inactive outlines, solid active fills, and a 160ms opacity fade only. No mount animation; reduced motion snaps. [Measurements and checks](../qa/creator-reference-2026-09-21/verification.md).

**Discover, September 21:** The working Discover page now follows Paper node 1UV-0, measured directly in `qa/discover-paper-2026-09-21/paper-reference.jsx.txt`. It uses compact search, collection cards, discovery shortcuts, a four-column gallery, and category tiles. `discover.css` owns the page. The two marked Daily section gaps increased by 16px, to 48px before Technical information and 40px before Check out more. See the [handoff and checks](../qa/discover-paper-2026-09-21/verification.md) for source measurements, intentional adaptations, and limits.

**Scrum refinement, September 21:** Julio's latest correction limits Scrum surface/control corners to 4–8px and softens hover strokes. Keep clear keyboard focus. This supersedes the earlier large-radius Scrum cards and pill-shaped controls; the shared top bar and phone/library component defaults stay unchanged. Area and Priority no longer appear in Scrum forms, cards, lists, planning rows, filters, or sort choices. See [Scrum workspace](SCRUM_WORKSPACE.md).

**Toast motion, September 21:** The prototype's shared notification now uses a compact 30px pill with 12/16 type. A 6px rise, small scale change, and subtle blur enter over 220ms and exit over 160ms. Text stays mounted through exit to avoid collapsing the pill. Repeated notifications reset the timeout; reduced motion removes movement and blur. The [toast handoff](../qa/compact-toast-2026-09-21/verification.md) records Emil Kowalski's references and local checks.

**Historical like-count correction, September 21:** Julio rejected the oversized reserved slot. Counts use natural-width [tabular numerals](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric) with kerning disabled. Equal-length values such as 24 and 25 keep the same pill width. Adding or removing digits gently changes the count width over 180ms; it never scales the text. The library demonstrates 0/1, 9/10, 24/25, 99/100, and 999/1,000. Today's former heart/count control was later replaced by the saved-by/Save group linked above. Earlier checks: [compact like counts](../qa/compact-like-counts-2026-09-21/verification.md).

The palette now has three gray primitives: dark `#252525`, medium `#6e6e6e`, light `#f2f2f2`, plus white `#ffffff` for the canvas. Semantic aliases reuse these values. Category pills use medium-gray text on light-gray surfaces. Dark-mode secondary text uses light gray for readability. Artwork, protected device chrome, and translucent image-viewer effects remain distinct from the solid interface palette.

Verification and captures: [stable counts and palette](../qa/stable-likes-palette-2026-09-21/verification.md).

**Like button, September 21:** `LikeButton.tsx` shares a subtle heart pulse between the Prototype, Daily pattern, and **Components → Like button**. It uses the existing [Motion library](https://motion.dev/docs/react-animation): a 320ms pulse on like and 180ms release on unlike. The state and count change immediately. Button geometry stays fixed, saved favourites do not animate on mount, and [reduced motion](https://motion.dev/docs/react-use-reduced-motion) disables movement. Today passes its original Paper icon; other placements use their existing Phosphor heart. No new package, animation file, or external asset is required.

**Selection motion, September 21:** Julio authorized the supplied soft gray surface and Morphing Select direction. The shared workspace selector and Scrum selection fields use `MorphingSelect`; Prototype Settings/Search use `SelectionPill`. Components now includes interactive Morphing select, Selection pills, and Rounded surfaces examples. The [implementation handoff](design/ROUNDED_SURFACES_AND_MORPHING_SELECT.md) preserves both references, motion values, and integration constraints. Keep PP Neue Montreal, monochrome states, compact controls, and the exact Today layout.

**Workspace navigation, updated September 24:** Prototype, Design system, and **Process documentation** share a full-width 44px dark bar. The third view retains `?view=scrum`. The bar contains the view selector on the left and the viewer's live local date and time on the right. It no longer shows the centered project label or **JC** badge. Narrow screens show a shorter date while retaining the full accessible label. `WorkspaceTopbar` is app-owned; protected phone geometry and runtime remain unchanged. Library search sits above the sidebar links, including inside Browse library on narrow screens. Preserve Escape behavior, focus restoration, and URL history. Process documentation uses three task stages and sequential epic codes; see its [handoff](SCRUM_WORKSPACE.md) and [top-bar verification](../qa/workspace-topbar-clock-2026-09-24/verification.md).

**Latest font decision:** Julio chose PP Neue Montreal for all app-owned screens and the design-system library. This includes the small Today labels that originally used Helvetica Neue in Paper. Sizes, spacing, and weights remain unchanged. Locally installed font faces supply the typography; protected device chrome keeps its native fonts.

Current font and artwork-tap checks are recorded in [the app-wide font and image-preview report](../qa/pp-app-image-preview-2026-09-20/verification.md).

**Latest viewer direction:** The viewer opens to Julio's September 20 screenshot crop, with landscape art at 72% of the phone height. David's opening focus is x=.62, y=.5. Native detail loads immediately and appears with a visible center-out tile reveal. Rendering uses final image dimensions and translation to preserve native sharpness. The September 21 correction reduces both captions to PP Neue Montreal at 14px / 18px, preserving the bottom-left anchor and 2px gap. The artist line includes the production date; approximate dates spell out “circa.” Close and download glass circles now measure 35.2px, with icons reduced by 20% and unchanged 44px touch targets. Glass gradient alpha remains 33.6% / 22.4%. Close and download remain the only controls. Fit remains available through reset and zoom-out. See [viewer mechanics](../qa/viewer-opening-2026-09-20/implementation.md) and [the size refinement](../qa/daily-editorial-2026-09-21/verification.md).

**Reading cleanup, September 21:** Leave 32px after Last edited before Technical information, with no divider above that section. Keep the technical heading underline and card borders. Source and editorial-project boilerplate no longer appears on Daily or artwork details; source, rights, and authorship records remain in data and documentation. The four-sentence Socrates entry follows the current editorial guide and does not establish a fixed length for other stories.

**Related cards and Discover, September 21:** Check out more uses 208px horizontal cards with uniform 208 × 156px cover crops, recorded focal positions, 8px corners/gaps, and semantic surface colors. Titles, creators, and dates occupy separate lines at 14/18, 12/16, and 11/14. Preserve the protected Carousel and current recommendation selection. Discover begins with the featured collection; redundant visible brand/page headings are removed, with its accessible main label retained. [Handoff and checks](../qa/related-cards-2026-09-21/verification.md).

**Local zoom experiment:** National Gallery's visible tile loading inspired a tap-to-detail interaction. Tapping inside the viewer zooms 1.6× toward that point over 340ms. Real 512px detail tiles refine a 768px preview from the opening crop. A 380ms fade and up to 180ms of center-out stagger make the reveal visible even with cached assets. A dim tile underlay clears during the reveal or immediately on failure. This is presentation timing; network requests are not artificially delayed. Gestures can interrupt zoom motion; reduced motion disables transitions. The original source remains the download target. Historical notes: [first experiment](../qa/gallery-zoom-2026-09-20/implementation.md). This behavior awaits Julio's visual review.

**Landscape test:** Julio reported that the square sharpening was not visible with the Dante image. Today now features David's *The Death of Socrates* with a 4000 × 2663 Met source and 512px detail tiles. Dante remains available as the preceding edition. The larger horizontal source tests refinement with more image detail; it does not establish visual approval. Latest checks: [David viewer verification](../qa/david-viewer-2026-09-20/verification.md).

**Latest Today correction:** Julio rejected the enlarged text, substituted fonts, and enlarged controls in the first Today implementation. The live Today screen now uses exact Paper typography and geometry, documented in the Today section below. Those values override the general library adaptations on this screen.

## Current direction — September 20, 2026

Julio rejected colored UI accents and asked for components much closer to his Paper Daily and Search frames.
Use only black, white, and gray for interface elements, including focus, selected, loading, and error states.
Artwork retains its own colors. Paper's orange navigation indicator is source evidence, not an exception to this direction.

Use compact elements and spacing derived directly from the linked Paper frames.
The active type scale is caption 10/12, label 12/16, body 14/20, section 16/20, title 20/24, and display 32/40.
These pairs mean font size / line height in CSS pixels.
Buttons are 32px high with 12px labels; small buttons are 28px high with 11px labels.
Chips are 24px high with 11px labels. Control groups use 4px gaps.
On coarse pointers, interactive controls expand to at least 44px without overlapping adjacent hit areas.

Keep Geist's library organization, navigation search, Preview / Code tabs, and section navigation. Make its documentation layout denser too.
The shared focus color becomes monochrome in the existing app. Check selected-chip foreground contrast in both themes.
Compact artwork cards use `density="compact"`; the default retains existing app-card geometry.
Compact metadata order is title, creator, then context, with 4px below the image and 2px internal gaps.
Preserve app behavior, protected runtime, locales, reader text options, and content boundaries.

This direction supersedes September 19's blue accents and larger library/component defaults, including body 16/26 and metadata 13/20.
Those older values are not instructions for new components. Existing app geometry is preserved where no compact variant is adopted.
Current checks and limits are in [the September 20 report](../qa/design-system-monochrome-2026-09-20/verification.md). Visual acceptance remains Julio's decision.

## Development approach

Build a small design system alongside the prototype. Start with the repeated decisions in Julio's Daily and Search screens.
Use those components in the next real flow, review the result, then extend the system where needed.
Start each flow with a reader need and a question to test. Try it with representative readers before treating the design as validated.
AI can accelerate implementation and variation. Generated screens and internal reviews do not establish customer demand or learning outcomes.

The design system has three connected parts:

1. Shared tokens and components used by code.
2. A browsable library showing variants, patterns, assets, and usage rules.
3. This handoff, recording sources, decisions, boundaries, and the extension procedure.

Paper remains Julio's visual design workspace. There is no automatic synchronization between Paper and this prototype.
Inspect the current Paper source before adopting later changes.

## Evidence from Q2 and Q3 2026

The recommendation above applies to Taste's current stage. These sources support its mechanics, not a universal development sequence.

| Source | Date and status | Practical implication |
|---|---|---|
| [Figma: The TL;DR on MCP](https://www.figma.com/blog/the-tldr-on-mcp/) | April 15, 2026; Q2 | Give agents meaningful component names, tokens, layout relationships, and interaction notes. Screenshots alone omit system intent. |
| [Storybook 10.4](https://storybook.js.org/blog/storybook-10-4/) | May 18, updated May 19, 2026; Q2 | Review component states in isolation. Agent setup and component metadata support reuse; rendered UI still needs review. |
| [Figma: Benefits of Code Connect in MCP](https://www.figma.com/blog/the-benefits-of-code-connect-in-mcp/) | August 5, 2026; Q3 | Map visual components to real imports and properties. Figma's evaluation covered 27 cases across two React systems. Its results do not predict this project's savings. |
| [Artsy Palette](https://github.com/artsy/palette) | Current repository documentation checked September 19, 2026; undated guidance | Share reusable primitives. Keep highly product-specific components near their use. Document variants beside the implementation. |
| [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/) | Stable report dated October 28, 2025; current published version checked September 19, 2026 | Use a portable token format when exchange is useful. It is a community specification, not a W3C Standard. |

The September 8, 2026 DTCG draft is a preview, not a stable implementation target.
Do not claim token-export conformance without validating the generated file against the stable format.
Storybook and Figma Code Connect are reference workflows; this starter does not imply either is installed.

## Visual source and deliberate adaptations

Primary project references: [Paper Search, node 1UV-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1UV-0) and [Paper Daily, node 1QL-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1QL-0).
Fresh measurements come from the September 20 [Daily export](../qa/design-system-monochrome-2026-09-20/paper-daily.jsx.txt) and [Search export](../qa/design-system-monochrome-2026-09-20/paper-search.jsx.txt).
These frames directly guide component density and composition. Artsy remains supporting visual context; Taste owns content and behavior.
Vercel Geist guides the library's organization, not the component styling.
The [September 19 Artsy direction](ARTSY_DESIGN_DIRECTION.md) is historical wherever it conflicts with the current direction above.

Values below are CSS pixels. Typography pairs mean font size / line height. The adaptation column describes the library's v0.2 baseline, not the corrected live Today screen.

| Decision | Measured September 20 Paper source | v0.2 decision or deliberate adaptation |
|---|---|---|
| Typeface | PP Neue Montreal TT Regular for editorial text; Helvetica Neue for search and micro labels; Inter for navigation | Use bundled Inter. No licensed PP Neue Montreal font files have been supplied for distribution. This is a font substitution, not a claim of exact typography. |
| Titles | Daily title and Search section titles: 14/16, regular, `0.01em` tracking | Pattern titles use 14/18. The shared section/page/display scale is 16/20, 20/24, and 32/40. These line heights and larger shared roles are adaptations. |
| Body | Daily paragraphs and Search discovery labels: 12/14, regular, `0.01em` tracking | Use 14/20 reading text. This is a deliberate sustained-reading adaptation, not the exact Paper value. |
| Metadata and controls | Search metadata: 10/12; chips and favourite counter: 8/10; chips have 2px vertical padding | Use 10/12 captions and 12/16 general labels. Chips use 11px labels and 24px height instead of Paper's smaller treatment. Buttons use 32px/12px or 28px/11px. |
| Secondary color | Search metadata and Daily counter: `#9B9B9B`; Daily creator: `#8B8B8B` | Use semantic gray values with verified text contrast. The lighter measured values are not automatically suitable for small text. |
| Active navigation | `#FF6334`, 4px top bar; 77px tab width in a 393px frame | Replace colored UI treatment with black/white/gray. No blue or orange focus, selection, or navigation accents. Preserve app navigation behavior. |
| Canvas and insets | 393px frame; 4px outer padding; several text/search groups add 4px | Pattern width is 393px, with 4px outer and 4px text insets. Adapt to narrower space without changing protected phone geometry. |
| Group spacing | 4px rail/gallery gaps; 8px groups; larger source section gaps vary | Use 4px gallery/control gaps and 8px related-group gaps. Keep the compact rhythm in the library documentation. |
| Artwork corners and metadata | Daily hero and Search rail: 4px radius; Search gallery thumbnails: 2px | Compact cards use title → creator → context, 4px below the image, and 2px internal gaps. Existing cards retain their geometry unless `density="compact"` is selected. |
| Search composition | Featured rail with 243 × 182px image canvases; two-by-two discovery tiles; four-column gallery | Preserve this order and density in the Search pattern. Replace mock labels and counts with clearly identified demo content. |
| Dividers and controls | 0.5px `#DDDDDD` dividers; pill search/chips; 2px category-label radius | Keep neutral borders and compact controls. Enlarge targets on coarse pointers while preserving distinct clickable areas. |
| Navigation labels | Inter 9/10.8, weight 800, `-0.2px` tracking | Source measurement only. This component pass does not replace the protected runtime or existing app navigation geometry. |

The reference contains mock content. The displayed artwork/title pairing, dates, repeated paragraphs, Picasso series, and artwork counts are placeholders.
Do not turn them into factual catalog records or infer collection membership from them.

## Geist library organization and historical measurements

Julio authorized Vercel's design-system framing for the browser library.
The measured references are [Geist Introduction](https://vercel.com/geist/introduction) and [Geist Button](https://vercel.com/geist/button).
Both pages were inspected live on September 19, 2026.
Preserve this library organization while applying September 20's denser documentation and monochrome styling.

Measurements below record the September 19 baseline, not the active v0.2 dimensions. The reference viewport was 1280px wide.

| Element | Measured Geist reference | September 19 library baseline; superseded where densified |
|---|---|---|
| Header | 65px including its border | 64px |
| Sidebar | 260px wide | 260px on desktop; 216px from 761px through 1100px |
| Main content | Left edge at 338px in the reference viewport | 48px content padding on desktop; 32px from 761px through 1100px |
| Page heading | 40/48, weight 600 | Bundled Inter, 40/48, weight 500 |
| Section heading | 24/32, weight 600 | Bundled Inter, 24/32, weight 500 |
| Example code | A Show code disclosure on the observed Button page | Preview / Code tabs with a Copy code action |
| Narrow layout | Not measured in this pass | At 760px and below: Browse library menu, single-column category tiles, and 20px content padding |

The observed Show code disclosure is intentionally adapted into Preview / Code tabs.
Taste retains its bundled fonts, content, and editorial ownership. Current shared components follow the compact monochrome direction.
The library stays light while component previews can switch between light and dark.
Geist branding, fonts, component code, and product content are not imported.

Current library dimensions, including the September 21 header update:

| Element | v0.2 library |
|---|---|
| Header | Shared 44px dark workspace bar |
| Desktop sidebar | 220px wide |
| Document spacing | 16px top, 24px horizontal/bottom; 16px on all sides at 760px and below |
| Page heading | 28/36, regular; 26/32 at 760px and below |
| Section heading | 18/24, regular |
| Component example padding | 16px |
| Pattern comparison | Two columns above 1000px; stacked at 1000px and below; each pattern has a 393px maximum width |

These library headings are documentation roles, separate from the shared component type scale.

Preserve the established library behavior:

- Grouped sidebar shortcuts to foundations, components, patterns, and resources. Shortcuts scroll to the matching heading.
- Find in library, above the sidebar links, which filters navigation labels and group names. It does not search artwork or story content.
- Six introduction tiles: Components, Color, Typography, Icons, Patterns, and Compositions.
- Preview / Code tabs for Buttons, Filter chips, Artwork cards, and Toggle. Switching tabs preserves preview state.
- A collapsible Browse library menu at narrow widths. Selecting a destination closes the menu and focuses the content.
- Escape clears a nonempty query when the search field has focus. Otherwise, it closes an open mobile menu before closing the library.
- Previous and Next actions between the six library sections.

There is no automatic Paper synchronization. This iteration makes no edits to Paper.
The [Geist framing verification report](../qa/design-system-geist-2026-09-19/verification.md) records historical checks and limits.

## Library and implementation boundary

Access the library through **Workspace view → Design system** or `?view=design-system`.
It opens at browser size through an app-owned dialog/portal. The phone runtime remains intact.
Closing it restores the prototype and focus to the opening control. Search state remains mounted while the library is open.

The implementation is organized under `app/src/design-system/`:

| File | Responsibility |
|---|---|
| `tokens.ts` | Editable foundation source for the app, library, and portable token export |
| `tokens.css` | Generated semantic CSS variables, including theme values; do not edit directly |
| `components.tsx` and `components.css` | Reusable controls and artwork components, with their presentation |
| `patterns.tsx` and `patterns.css` | Starter compositions derived from Daily and Search, with their compact layout rules |
| `assets.ts` | Catalog of reusable local assets and source/rights context |
| `DesignSystem.tsx` and `design-system.css` | Browsable library, examples, exports, and extension brief interface |
| `PreviewCode.tsx` and `preview-code.css` | Library-only Preview / Code tabs, persistent preview panels, keyboard navigation, and code copying |

`patterns.css` owns the Daily and Search pattern presentation. Do not restore older pattern rules in `design-system.css`.

`ArtworkCard` and `Toggle` are the first shared components adopted through the existing app wrappers.
Other catalog components and patterns are starter proposals. Their presence does not mean every app screen uses them.
Check a component's actual imports before describing its adoption.

The production build runs `scripts/export-design-system.mjs` first. It generates `tokens.css` and downloadable snapshots in `app/public/design-system/` from the authored TypeScript data.
Use `npm run export:design-system` after changing tokens during development. `npm run check:design-system` checks for drift without writing.
The build preserves the original runtime integrity check. Generated snapshots are local files, not a cloud publication.

| Export | Entry point |
|---|---|
| `Button` | `components.tsx`; primary, secondary, or ghost; small or medium; loading and disabled states |
| `Chip` | `components.tsx`; controlled `selected` state and button event handlers |
| `ArtworkCard` | `components.tsx`; `image`, `title`, `creator`, `meta`, and `onOpen`; optional image position and `density="compact"`; compact metadata is title, creator, then context |
| `Toggle` | `components.tsx`; `ariaLabel`, `checked`, and `onChange` |
| `DailyStoryPattern` | `patterns.tsx`; isolated reading composition with local save state |
| `SearchDiscoveryPattern` | `patterns.tsx`; `onOpen(title)` callback, demo filters, and discovery tiles |
| `sampleArtworks` | `patterns.tsx`; demonstration content, not a production catalog |
| `tokenDocument` | `tokens.ts`; portable draft token data for export |

The library includes token export, component/pattern snippets, SVG downloads, and a downloadable new-component brief.
This is reusable code and documentation with interactive examples, not a full visual component editor.
A brief does not automatically create or approve a production component.
Initial starter checks verified downloaded token JSON, gallery SVG, and the component brief on disk.
The copy action showed success, but the browser clipboard abstraction did not independently confirm its contents.
These initial download checks are not a claim that every export was tested again during the framing change.

## Reuse and extend

### Artwork information — September 21, 2026

Follow border refinement: both resting states use `--dc-divider`, following Julio's rejection of the dark stroke. Hover/press borders match the inverted fill. Text and keyboard-focus contrast remain unchanged.

The creator card now uses shared `FollowButton.tsx`. Supply separate `followLabel` and `followingLabel` strings, a current accessible label, controlled `following`, and the click callback. Both labels reserve space. The control uses monochrome hover inversion, gentle press compression, a 240ms label transition, and a drawn check. Reduced motion is instant; saved state does not animate on mount. See [Follow interaction verification](../qa/follow-interaction-2026-09-21/verification.md).

`TechnicalInformation` and `CreatorBiography` in `app/src/design-system/ArtworkInformation.tsx` are shared by Daily and artwork details. The library's **Components → Artwork information** example includes Preview / Code and isolated Follow state. Creator profiles share the same biography and app follow state.

Use a thin bordered facts panel followed by a thin bordered creator card. Defaults: 14/18 headings, 12/16 copy, 16px padding, 12px field gaps, a 36px circular artwork thumbnail, and a 28px outlined Follow pill. Coarse pointers expand the action to 44px. Content wraps within available width. The live Today wrapper keeps its 4px outer inset; its preceding geometry remains unchanged.

`ArtworkInformationSection.tsx` owns localized labels and units. `artwork-information-data.ts` owns sourced biographies and physical measurements. Omit unverified size and sale-specific claims such as signature or frame inclusion. Library interactions must not update saved app preferences. See [handoff](../qa/artwork-information-2026-09-21/implementation.md), [sources](../qa/artwork-information-2026-09-21/content-sources.md), and [verification](../qa/artwork-information-2026-09-21/verification.md).

### Extension workflow

1. Inspect the relevant existing component and pattern. Reuse its exported API when it fits.
2. Prefer a supported variant over a new component. Use semantic tokens instead of unrelated local values.
3. For a new need, write a brief: purpose, Paper source node, measured anatomy, content, states, and interactions. Record deliberate adaptations separately.
4. Keep a one-off experiment close to its screen. Promote it when a clear shared use emerges.
5. Add the shared implementation and catalog example together. Include meaningful selected, disabled, empty, and error states where relevant.
6. Adopt it in a real flow. Verify the flow and the isolated example before expanding its use.
7. Update this handoff when a visual decision changes. Record proposals separately from Julio's approvals.

Every new-component brief should require monochrome UI, the compact type/control scale, and responsive behavior.
Specify keyboard operation, coarse-pointer target sizing, text contrast, and acceptance criteria.
Identify whether the component changes an existing app wrapper or only adds an optional compact variant.
Do not add a colored status treatment or restore September 19's larger defaults through a new variant.

Example implementation prompt:

> Build the requested Taste (V1.2) flow using the current compact monochrome direction. Read `docs/DESIGN_SYSTEM.md` and `app/AGENTS.md` first. Inspect `Button`, `Chip`, `ArtworkCard`, and `Toggle` in `app/src/design-system/components.tsx`. Check `DailyStoryPattern` and `SearchDiscoveryPattern` before composing a new layout. Use the linked Paper nodes as direct visual references. Reuse exports and semantic tokens; edit `tokens.ts`, not generated `tokens.css`. Use `density="compact"` when appropriate without changing default app-card geometry. Keep interface colors black, white, and gray while preserving artwork color. Record measured values and deliberate adaptations separately. Preserve Daily gestures, locales, themes, reader options, runtime, and content rights. Add implementation and catalog examples together for missing components. Verify the rendered result and its interactions. Do not present Paper placeholders as factual content or edit Paper automatically.

## Accessibility, content, and verification

- General compact controls expand to at least 44px on coarse pointers. Today's 20px action group is a scoped exception. The image viewer retains 44px touch controls.
- Provide keyboard operation, visible focus, meaningful labels, and correct selected/disabled semantics.
- Check contrast against the actual surface in both themes. Today's default Light presentation preserves Paper's exact pale metadata by Julio's explicit fidelity request; Dark uses semantic colors.
- Test long labels, all four locales, larger reader text, and narrow layouts. Allow content to reflow.
- Preserve reduced-motion handling, nested rail gestures, Daily drag/wheel/keyboard behavior, and contribution drafts.
- Use the protected keyboard-aware fields inside the phone. Browser-sized library fields belong to the library surface.
- Preserve the protected runtime, device picker, safe areas, live status bar, and existing theme/preference persistence.
- Keep Julio's editorial authorship explicit. Read [the content rights register](../app/public/assets/content/README.md) before reusing images.
- Reference captures are evidence, not shipped assets. Do not import Artsy branding, fonts, artwork, or copy from reference screens.

Before handoff, run the protected runtime check and production build. Inspect library navigation, keyboard focus, exports, and return behavior.
Check adopted components in the real prototype on iPhone and Pixel when changing their behavior or presentation.
Initial starter checks and limits are recorded in [the starter verification report](../qa/design-system-2026-09-19/verification.md).

Historical September 19 verification: the Geist framing change passed the production build, protected runtime check, and token consistency check.
At a 390px viewport, all six library sections had `scrollWidth = clientWidth = 390px`.
Anchored navigation, keyboard tab operation, preserved preview state, and mobile Escape behavior also passed.
This was a library-focused check. It did not repeat the full mobile app test suite.
These earlier results do not verify the September 20 compact monochrome update.
The September 20 build, protected runtime check, and generated-export consistency check passed. Browser checks covered desktop and 390px layouts, both component themes, preview-state preservation, pattern interactions, and iPhone/Pixel selected-chip contrast. See [the September 20 verification report](../qa/design-system-monochrome-2026-09-20/verification.md) for limits. This is a verified local variation, not Julio's visual approval.

Keep review local at `http://127.0.0.1:4173/`. This starter does not authorize deployment.

## Today page adoption — September 20, 2026

The working Daily screen now adopts Paper’s artwork-first reading composition through `TodayArticle` in `Prototype.tsx`. The isolated `DailyStoryPattern` remains a starter example, not the live app component. `prototype.css` owns the live Today geometry; `patterns.css` still owns the isolated catalog composition.

Use two category labels by default, with a maximum of three. Keep the title, creator, work date, saved-by count, Save/board action, and full-screen control close together. Both the artwork and full-screen control open the viewer with tap-to-detail, pan, pinch, wheel, keyboard zoom, and download. Reset remains available through 0/Home and double-tap; no zoom or reset buttons appear. The artwork remains a scroll and edition-drag surface; only a tap or keyboard activation opens the viewer. The viewer loads a preview first, then visible detail tiles when zoomed. Downloads retain the full original image file. Enlarging the image does not add source detail.

Julio rejected the first implementation's enlarged text and controls. The corrected default Light presentation follows the freshly extracted Paper values:

| Element | Exact default |
|---|---|
| Editorial font | PP Neue Montreal TT Regular, weight 400; `0.01em` tracking |
| Title and creator | 14px / 16px; title `#111111`, creator `#8B8B8B` |
| Reading text | 12px / 14px; `#111111`; 16px paragraph gaps |
| Paragraph widths | First 345px, second 377px, third 325px; capped to available width |
| Last edited | 10px / 10px; `#DDDDDD` |
| Categories | PP Neue Montreal Regular, 8px / 10px |
| Today title actions | 20px high with 8px group gaps and shared 8/10 count and Save labels; saved-by `+count`, text-only Save/board pill, and separate full-screen circle. See the September 23 handoff above. |
| Category labels | 14px high, 2px × 6px padding, 2px radius, 8px gap, `#F2F2F2` background |
| Image | 420px high, 4px radius, 4px outer inset; 385px wide at the 393px source canvas |
| Metadata | 12px below the image; 4px inner text inset; 8px before categories |
| Dividers and reading | No divider between categories and story, or after Last edited. Category-to-story gap is 16.5px, reduced by 16px total. Keep 32px before Technical information. |

Fonts load from this Mac through CSS `local()`, with shared faces in `app/src/design-system/fonts.css`. The shared font token uses PP Neue Montreal throughout the app and library. No font file is copied or bundled. Other machines require matching installed fonts or authorized webfonts for an exact match; fallback rendering is not an exact match.

The general 44px coarse-pointer expansion does not apply to Today's compact actions. The separate image viewer retains 44px touch controls. Explicit Large/System reader choices and Dark mode remain supported adaptations. Preserve the live phone status region, independent Daily gestures, all locales, and saved reader state. Keep app-owned story content and navigation; Paper contains placeholder metadata and repeated paragraphs.

Editorial timestamps belong to each story record. Legacy stories have none; their last-edited row explicitly says the date was not recorded. Source and draft editorial credits remain below the reading block.

[Exact-source export](../qa/today-paper-exact-2026-09-20/paper-daily.jsx.txt), [font verification](../qa/today-paper-exact-2026-09-20/font-verification.md), and [current verification](../qa/today-paper-exact-2026-09-20/verification.md) record the corrected implementation. The earlier [implementation handoff](../qa/today-paper-2026-09-20/implementation.md) is superseded for typography and geometry. Its viewer behavior and content-rights notes remain relevant. Paper remains unchanged.
