# Taste (V1.2) Mobile Prototype Agent Guide

## Approved painting update and publication — 2026-09-27

- Applied only three requested sentence deletions: two in Saturn Devouring His Son and one in The Gulf Stream. Other 74 review bodies and all 76 image sets remain unchanged. Addressed comments moved to revision history.
- Imported Saturn and The Death of Socrates with selected image A, and updated Liberty Leading the People to its newly approved body. The app now has 20 works; its other 17 records are unchanged. Existing Goya/David biographies accompany sourced artwork facts.
- The Gulf Stream is revised but still pending writing approval. Other pending revisions do not replace older approved app records. Keep the original frozen submission package intact.
- Published to https://taste-capstone.vercel.app/ on the existing Taste Vercel team. Deployment: `dpl_CFyrE4NyfPzvBeoobrc7kdpb2VF5`. Public bundle and selected images verified against the local build.
- Fresh capture and checks: `qa/painting-approval-import-2026-09-27/`; import evidence: `docs/editorial/imports/prototype-2026-09-27-paintings/`. Incremental importer: `app/scripts/update-approved-paintings.py`.

## Editorial expansion, artwork facts and restored onboarding — 2026-09-26

- Batch 004 adds five paintings (Nighthawks, The Gulf Stream, The Floor Scrapers, The Execution of Lady Jane Grey, Hunters in the Snow), five films (Good Will Hunting, Perfect Days, Cinema Paradiso, Spirited Away, Modern Times), and replacement photography studies by Dorothea Lange and Martin Parr. Each has three authentic local choices and starts pending review. The 43 retained bodies, saved decisions, notes and comments are unchanged.
- The review has 55 active works across eight media: 18 currently approved and 37 to review, including three held theater entries. Engalo and Chim remain archived but leave the active queue; Salgado, Sternfeld and Addario remain. Different photography exposures are separate photographs with individual captions, never artificial variants.
- The five older cinema drafts now also have three local image options each. No cinema images remain pending download. Four new-film frames came from ShotDeck; other choices use the recorded studio, distributor, festival or film-gallery sources. Do not describe every image as a ShotDeck download.
- Only the existing 18 approved entries remain in the normal app. New candidates need separate writing approval, an eligible image selection, resolved comments and a requested import. The frozen submission package stays unchanged.
- Sourced technical facts and short English creator biographies for the imported catalog live in `app/src/editorial-information.json` and its typed adapter. Unknown facts remain absent; translations need review. Existing approved bodies and chosen image files are preserved.
- Reading images fill their existing frame. Marat alone uses `center bottom`; the expanded viewer still shows the complete image. Onboarding restores Girl with a Pearl Earring, The Kiss and the Dante portrait from the original local assets.
- Evidence: `qa/editorial-batch-004-2026-09-26/verification.md`, `qa/artwork-details-2026-09-26/verification.md`, `qa/artwork-preview-fill-2026-09-26/verification.md`. Research: `docs/editorial/batches/batch-004/research.md`. These changes were checked locally; this task did not deploy them.

## Public review deployment and Home wheel correction — 2026-09-26

- The authorized CP193 review prototype is live at `https://taste-capstone.vercel.app/`, with Process documentation at `?view=scrum`. Project `taste-capstone` uses the separate `juliocaggiano2022-8011s-projects` team. Keep deployment account/config separate from the portfolio.
- `DailyPager` locks the horizontal axis through an entire wheel burst. Trackpad tails can change dominant axes; do not let them leak into the parent reading scroller. Fresh vertical gestures still scroll after the existing idle interval. Preserve one-edition movement, chronology and nested-rail exclusion. The protected Carousel and MobileScroll remain unchanged.
- Build and focused iPhone/Pixel tests passed in Chromium and WebKit. Evidence: `../qa/home-scroll-jitter-2026-09-26/verification.md`.

## Approved editorial catalog — 2026-09-25

- Julio authorized the current 18 Approved-tab works for the normal prototype: eight paintings, three music entries, three books, three films and David. They replace the ten unreviewed sample records. This supersedes earlier “no app import” notes below.
- Import the exact approved body and current selected image. Music retains the vinyl composition; literature retains the rectangular cover and gray frame. September 26 correction: reading previews fill their frame with `object-fit: cover`, within the existing 420px height limit. Preserve aspect ratio, focal position and current frame dimensions; crop overflow instead of adding side bars. The expanded image viewer keeps its complete-image behavior. This supersedes the September 25 contain setting.
- App data: `app/src/approved-catalog.json` and `approved-catalog.ts`; images: `app/public/assets/editorial/`. Review evidence: `docs/editorial/imports/prototype-2026-09-25/`. Reference paths here are relative to the project root.
- Keep the 27 unapproved/held entries outside the normal app. Historical explicit comparison-study routes retain their original sample fixtures. Retired sample saves/notes/folder references stay stored without remapping to different artworks; Library shows current catalog records only.
- Approved text stays English until translations receive separate review. Do not invent creator biographies, lifetimes, physical specifications or edit timestamps for missing data. New image/form metadata must remain consistent across search, category filters, details and the viewer.
- Future review changes require a fresh requested import. The initial frozen 12-entry package stays unchanged. No public deployment occurred. Handoff: `docs/editorial/PROTOTYPE_IMPORTS.md`; checks: `qa/approved-catalog-import-2026-09-25/verification.md`.


## Process task deletion — 2026-09-25

- An existing Scrum task editor offers Delete task with a named confirmation. Keep task is the initial focus; new unsaved tasks have no Delete action. Deleted IDs persist as tombstones so future update batches cannot restore removed cards.
- Sources: `src/scrum/ScrumWorkspace.tsx`, `src/scrum/model.ts`, and `src/scrum/scrum.css`. Verification: `../qa/process-task-delete-2026-09-25/verification.md`.

## Public Process documentation narratives — 2026-09-25

- The Scrum seed and guarded update batch produce 51 self-contained process cards. Keep task descriptions readable on a future Vercel page without private local paths. Preserve user-edited fields when upgrading old cards.
- Current review boundaries: 12 approved editorial entries prepared for later import, 15 new unapproved drafts, no app import, and no completed reader pilot. AI-assisted implementation and the separate product choices are stated on the board.
- Sources: `src/scrum/projectUpdates.ts`, `src/scrum/model.ts`, and `../docs/SCRUM_WORKSPACE.md`. Verification: `../qa/process-public-narratives-2026-09-25/verification.md`.

## Library search and interface polish — 2026-09-25

- The normal Library overview has a top Search control for saved artworks and a Medium selector beneath Artworks. Search matches title, creator, date, medium, and country; it combines with the shared filters. Hide the folder rail while a query is active. Keep these controls out of folder detail and comparison routes.
- Tighten the Artworks-to-grid gap to 8px in the normal Library. Keep folder and artwork contents tied to the current account.
- Back arrows across app pages have transparent backgrounds while retaining their touch targets and focus states. Arrows over artwork use a white glyph with a dark shadow for contrast. This supersedes earlier pale Back surfaces below.
- Explore's Gallery preview ends with a text-only **View all** button. A thin divider and added space separate it from Explore by category. Increase space around the Discover/Gallery divider too.
- Home allows vertical mouse-wheel scrolling over the artwork carousel. Keep horizontal wheel navigation between editions.
- Sources: `src/LibraryStudyScreen.tsx`, `src/library-study.css`, `src/Prototype.tsx`, `src/discover.css`, `src/prototype.css`, and related component styles. Verification: `../qa/ui-polish-2026-09-25/verification.md`.

## Compact Library action and larger folder covers — 2026-09-24

- New folder uses a muted text action with a 12px Plus, 4px gap, and transparent resting background. Keep the existing 44px touch target and subtle hover/press feedback.
- Overview folder covers are 168 × 126px, with the existing 4:3 crop, 4px corners, and 12px horizontal rail gap. Keep the toolbar height unchanged.
- Library heading-to-rail margin is 16px; overview Artworks heading-to-grid margin is 12px. Each is 4px less than before. Preserve artwork row/column spacing and folder-detail layout.
- Sources: `src/library-study.css` and `src/LibraryStudyScreen.tsx`. Verification: `../qa/library-overview-polish-2026-09-24/verification.md`.

## Menu-only blur and searchable artwork filters — 2026-09-24

- Bottom scroll blur appears only with the floating navigation menu. The shared menu-render condition also gates blur; artwork/collection details, View Profile, creator/account profiles, Home search, Create and its exit transition, keyboard, sheets, and full-screen viewing suppress it. Returning to a menu page restores the existing scroll-dependent blur. Keep the protected runtime unchanged.
- Shared artwork filters use searchable Artist and Country choosers, with options derived from the current catalog. Country replaces the visible Place label; the existing internal `place` field remains unchanged. Discover's country shortcut uses the same wording.
- Artwork date offers decade and century presets above editable From year/To year fields. Selecting a preset fills the range; custom input remains available. Remove the previous explanatory date paragraph. Keep validation, draft-only edits until Done, Reset, focus return, and all four locales.
- Sources: `app/src/Prototype.tsx`, `app/src/ArtworkFilterSheet.tsx`, `app/src/SearchableArtworkFilter.tsx`, and `app/src/artwork-filter-sheet.css`. Verification: `qa/filter-search-and-menu-blur-2026-09-24/verification.md`.

## Shared workspace top bar — 2026-09-24

- All workspace views use the 44px dark bar with the view picker on the left and a live local date/time on the right. The old centered project label and **JC** badge are removed. The full display uses weekday, month, ordinal day, and a.m./p.m.; narrow screens use a compact date/time but retain the full accessible label.
- Keep the workspace picker, phone geometry, focus behavior, and URL navigation. Source: `src/design-system/DesignSystem.tsx` and `src/design-system/design-system.css`. Verification: `../qa/workspace-topbar-clock-2026-09-24/verification.md`. This supersedes older top-bar descriptions below.

## Selected Library overview and expanded artwork filters — 2026-09-24

- Julio selected **Library overview** as the normal Library: folder covers above all saved artworks. Use the current account’s actual saves/folders. Explicit `library-study=compact|switcher|overview` routes retain disposable comparison data; the comparison now initially shows Overview. This supersedes the unselected/default-unchanged note below.
- Folder detail places Back alone in the top row. The title/count and Filters/grid/list row sits underneath. Back uses a 24px pale square with 4px corners and a 14px chevron, inside a 32px fine /44px coarse target. Keep artwork/detail return, folder rail position, focus and all existing account persistence.
- All artwork Filters/Sort & Filter controls share `ArtworkFilterSheet`: default/title/oldest/newest sorting, Medium, Artist, Place, and an inclusive From year/To year range. Blank bounds are open-ended; equal years select that year; invalid/reversed ranges cannot apply. Draft changes commit with Done; Reset clears the draft. Creator filters retain Saved works.
- Date matching uses numeric catalog bounds separate from localized display dates. Recorded periods match ranges they overlap; c. dates use the displayed year, without inventing a tolerance. Preserve recorded display labels. Filters stay local to their screen and survive artwork detail return.
- Sources: `app/src/LibraryStudyScreen.tsx`, `library-study.css`, `GalleryControls.tsx`, `ArtworkFilterSheet.tsx`, `artwork-filter-sheet.css`, `artwork-filters.ts`, and `Prototype.tsx`. Verification: `qa/library-overview-filters-2026-09-24/verification.md`.


## Switch Accounts preview — 2026-09-24

- Settings opens an interactive chooser and Add account page. Julio's existing account and a fictional Leila account have separate local saves, folders, notes, preferences, follows, collections, and Create drafts. New accounts begin empty. Julio's original storage keys remain intact.
- Email and Apple/Google/Facebook actions create local preview identities only. Do not persist the entered email or imply real sign-in, email delivery, or cross-device sync. Switching updates Settings, Profile, Library, and saved artwork controls and lands on Settings.
- Preserve Back, X, Escape, focus, four locales, Dark mode, reduced motion, device safe areas, and temporary study routes. Language is titled **Switch language** without a description; Notifications omits its description and prototype note. Sources: `src/SwitchAccountsFlow.tsx`, `src/switch-accounts.css`, `src/account-preview.ts`, `src/Prototype.tsx`, `src/today-savers.ts`. Verification: `../qa/switch-accounts-2026-09-24/verification.md`.
- The chooser's only visible heading is **Accounts on this device**. Keep its top-right X and accessible dialog name; omit the redundant top **Switch accounts** title and local/sync footer.
- Add account has no visible page title or **Use another account** heading. Show the email field and action, then **Or continue with** and centered Apple, Google, and Facebook buttons. Keep Back, X, the accessible dialog name, and the short local-preview sign-in note.

## Library navigation comparison — 2026-09-24

- Compare three unselected layouts at `http://127.0.0.1:4173/library-study.html`: **Compact tabs** (`compact`) combines Artworks/Folders counts and gallery actions in one header; **Single switcher** (`switcher`) uses one section dropdown; **Library overview** (`overview`) places a folder rail above saved artworks. Explicit `?library-study=` routes enter Library directly. The normal Library stays unchanged until Julio chooses.
- All variants use the same disposable sample of five existing artworks and three folders, including an empty folder and an artwork outside folders. Folder creation, notes, saves, follows, preferences, collections and Create drafts remain temporary. Reset reloads the sample; never write it to the user's saved Library.
- Reuse shared artwork lists, gallery controls, folder creation and artwork detail/return behavior. Keep two-column natural-ratio artwork grids, 12/16px captions, muted creator text, 16px row gaps and 4px column gaps. Folder covers and Back controls use 4px corners. Keep keyboard navigation, focus/scroll restoration, theme tokens, four locales and reduced motion.
- Sources: `app/src/LibraryStudyScreen.tsx`, `library-study.css`, `library-study-data.ts`, root `Prototype.tsx` study guards and `today-savers.ts`. Comparison: `app/public/library-study.html`. Verification: `qa/library-navigation-2026-09-24/verification.md`. These are interactive options for review, not a selected design.


## Text-only Taste wordmark — 2026-09-23

- Use **Taste** as the visible wordmark in Process documentation and the Prototype masthead. Remove the supplied sidebar silhouette and its reserved space across all Process views; the icon-comparison page uses the same text wordmark.
- Preserve functional workspace-picker, navigation, and action icons. The versioned project label remains **Taste (V1.2)** outside wordmark positions. Sources: `src/scrum/ScrumWorkspace.tsx`, `src/scrum/scrum.css`, `src/Prototype.tsx`, and `public/process-icons.html`. Checks: `../qa/text-wordmark-2026-09-23/verification.md`.

## Search controls and shared artwork lists — 2026-09-23

- Expanded Home search has the normal Search glyph on the left and an **X on the right to close**. A localized **Clear** text action appears only with a query, preserving distinct clearing and dismissal. Coarse-pointer targets remain44px high and at least44px wide.
- Gallery, Artists and Accounts reserve the same heading-row height: **32px fine /44px coarse**. Keep centered title alignment; conditional Filters/view controls must not shift titles or result counts between scopes.
- Search/Home List, Library Artworks List and collection contents use **ArtworkListRow**. Shared geometry: **64px 3:2 image**,2px image corners,16px column gap,8px vertical/4px horizontal padding,60px minimum row height and thin dividers. Title uses13/16px at500; author and artwork date share the second line in `--app-muted`. Large text uses14/18px consistently.
- Keep grids, artwork rails, people lists and historical comparison-study layouts distinct. Shared list navigation preserves existing artwork detail/return behavior. Do not duplicate row CSS in individual screens.
- Sources: `app/src/ArtworkListRow.tsx`, `app/src/artwork-list-row.css`, `app/src/Prototype.tsx`, `app/src/discover.css`, `app/src/home-search-surface.css`. Evidence: `qa/search-list-consistency-2026-09-23/verification.md`.


## Semester sprint outline and backlog assignment — 2026-09-23

- Product backlog table rows have a Sprint dropdown beside Status. It offers only planned sprints that have not ended, including an unstarted current sprint. Assignment preserves other task fields, restores archived tasks to active work, and returns focus to the next backlog selector or navigation.
- Blank planned Sprints 3–9 continue the 14-day cadence from 28 September through 3 January. Sprint 9 covers late December. Existing saved boards receive them once while preserving custom sprint settings and avoiding overlaps. Later removed placeholders stay removed.
- Source: `src/scrum/seed.ts`, `model.ts`, `ScrumWorkspace.tsx`, `scrum.css`. Handoff: `../docs/SCRUM_WORKSPACE.md`; checks: `../qa/sprint-assignment-2026-09-23/verification.md`. Visual acceptance remains Julio's decision.

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


## Variable reading image heights trial — 2026-09-23

- Julio requested varied Daily artwork heights, especially a shorter Great Wave. Shared `TodayArticle` now uses each image's native aspect ratio, capped at **420px**. Landscapes are shorter; portraits keep their existing capped cover crop and focal position. This trial supersedes the uniform 420px hero below, and also applies to opened artwork details.
- The ten Piece records include measured `imageWidth`/`imageHeight`; pass them to the reading image to reserve space before loading. Preserve full width, 4px corners, page gutters, text/action spacing, Daily navigation and full-screen viewing. Gallery thumbnails remain independent.
- Great Wave measures about **266px** high at the iPhone's 377px image width and **290px** at Pixel's 411px width. Build, image metadata, visual previews and viewer return verified. This is a local trial awaiting Julio's visual review. Handoff: `../qa/variable-daily-images-2026-09-23/verification.md`.

## Single saved-by avatar — 2026-09-23

- Daily's saved-by control shows **one profile avatar** beside the count, replacing the two-avatar preview. Apply through shared `TodaySaveActions` across all Daily editions and artwork details. Keep the first saver, including the current reader after saving, the 22px avatar, opaque count pill, rolling count, and complete people sheet unchanged.

## Back controls and Explore list dates — 2026-09-23

- App-owned Back arrow surfaces use **4px corners**, superseding the circular Back guidance below. Preserve each control's icon, dimensions, hit area, focus, themes, and navigation. Apply to Explore, artwork details, collections, creator profiles, user profiles, and onboarding; Create already uses 4px corners.
- Explore Gallery **List** captions show **creator, artwork production year**, using the same localized `piece.year` value as Home. Preserve approximate dates, periods, and recorded spans. Grid captions and row geometry stay unchanged.

## Home header icon proportions — 2026-09-23

- Home Shuffle/Search SVGs are now **10px**. Julio found 14px too large and 8px too small; this slight increase supersedes the 8px trial. Keep 22px visible circles, current hit areas, original shapes, and all surrounding geometry. Expand is unchanged. This supersedes the 14px Home Search/Shuffle glyph size below. Verified local build and preview: `qa/home-header-glyphs-2026-09-23/verification.md`.

## Favorites gallery controls — 2026-09-23

- Library → Artworks shares Explore's Filters, Grid, and List actions through `app/src/GalleryControls.tsx`. Sort by Featured or title in either direction; filter by Medium, with Reset filters and Done. All labels support four locales.
- Preserve two-column grid, 4px gaps, 8px side gutters, portrait cap, and existing grid typography. List uses equal 64 × 64px cover crops, recorded focal positions, and 12/16px text with the Large-text override.
- Keep Artworks filters and layout independent from Folders. Retain them when opening/closing artwork details or switching between Artworks and Folders. Filtered empty results offer Reset filters and an accurate count.
- Verified build, protected runtime, iPhone/Pixel layout, sort/filter/reset, detail return, Folders isolation, and Explore shared controls. Evidence: `qa/favorites-gallery-controls-2026-09-23/verification.md`. Visual approval pending.

## Approximate artwork dates — 2026-09-23

- Show approximate artwork production dates as **c. + one year**, without a date range. Chart of Hell displays **c. 1480** by Julio's choice. Use **c.** for approximate artist birth years too. Keep documented spans without an approximation marker and artist birth/death ranges distinct. Change shared records so Today, details, cards, search, creator profiles, and the viewer agree. This supersedes the older instruction to spell out “circa.” Verification: `../qa/date-abbreviation-2026-09-23/verification.md`.

## Explore List reference — 2026-09-23

- Julio supplied a directory-style reference. Explore Gallery List now uses a fixed 64px image column, 3:2 cover thumbnails, a 16px column gap, and top-aligned title/creator. Julio rejected the earlier 22%-wide 2:1 thumbnails and excess whitespace. Preserve existing focal positions and localized text.
- Use 8px vertical/4px horizontal row padding, 60px minimum height, no gaps between rows, and 0.5px dividers using muted text at 22% opacity. Use 13/16px primary text, medium-weight titles, and allow long text to increase row height. This supersedes the earlier 64px square, vertically centered list thumbnails.
- Keep each row as the existing artwork-opening button. Preserve focus/scroll return, sorting, filters, and the nine-work preview. The three-column Grid view stays unchanged. No extra plus/save action is added from the reference.
- Handoff and checks: `qa/gallery-list-reference-2026-09-23/verification.md` (relative to the project root). Visual approval remains Julio's decision.

## Library artwork grid and Home icon trial — 2026-09-23

- Library **Artworks** now follows Explore gallery styling with two equal columns, 4px gaps, natural image heights capped at 125% of column width, and title/creator captions at 10/12px. Artworks now uses the shared 8px Explore side insets, with full-width tabs. Preserve Large text adaptation. Folders keep their prior design and 20px insets. Scope: `data-library-section="pieces"` in `Prototype.tsx` and `prototype.css`.
- Floating-menu Home now trials a local house with roof overhangs and a narrower body in `NavigationIcon.tsx`; selected uses a stroke-free fill, inactive uses 1.75px outline. Preserve 20px icon, 44px target, glass and selection motion. This supersedes the lower-roof menu glyph for local review; shared House glyph stays unchanged.
- Checks: `qa/library-grid-home-icon-2026-09-23/verification.md`. Build, protected runtime, iPhone/Pixel dimensions, and Folders preservation verified; visual approval pending.


## Gallery sizing and Back control — 2026-09-23

- Gallery previews nine artworks in a three-column, three-row grid. Keep Show all for the complete set and preserve the existing image crops.
- Filters uses smaller 12/16px text. Preserve its spacing, caret, order before Grid/List, and hit area.
- Discover something new cards have a 72px minimum height, with top-left text alignment and 12px padding. Preserve the two-column layout and typography.
- When Gallery follows Discover something new, reduce the combined section spacing from 52px to 24px, preserving the thin divider and other section gaps.
- Expanded and filtered Gallery Back uses the artwork-detail style: an icon-only 32px circle, 14px CaretLeft, surface fill, and muted glyph. Keep the localized accessible label, return behavior, focus outline, and 44px coarse-pointer size.

## Gallery Filters control — 2026-09-23

Gallery actions now read Filters + chevron, Grid, List, in that visual and keyboard order. Use transparent rest, muted 12/16px type, 4px corners, quiet hover/open fill, and a 4px active dot. Keep the label visible in expanded Gallery. Preserve the existing Sort & Filter sheet, localized labels, reset/sort/medium behavior, focus restoration, 44px coarse targets, and reduced-motion support. This replaces the rejected filled sliders button. Checks: `../qa/gallery-filter-control-2026-09-23/verification.md`.

## Explore Gallery refinement — 2026-09-23

- Normal Explore now omits Collections. Search, Discover something new, Gallery, then Explore by category remain in that order. Saved study routes retain their original layouts.
- Gallery previews nine artworks in three rows and three columns. A centered **Show all** pill below the preview opens the complete Gallery with Back, grid/list controls, and Sort & Filter. Back restores the preview scroll/focus; artwork detail retains the expanded view and filters.
- Sort & Filter uses the shared sheet: Featured, Title A–Z, Title Z–A, and Medium, with Reset filters and Done. New category or primary search-scope selection clears the extra Gallery medium constraint. No Show all action appears for zero results or when the preview already contains every result.
- List images use equal **64 × 64px cover crops**, preserving recorded focal positions. Grid retains three columns and the existing portrait cap. Typography, category cards, themes and protected phone runtime stay shared.
- Source: `app/src/Prototype.tsx` and `app/src/discover.css`. Verification: `qa/gallery-expansion-2026-09-23/verification.md`.


## Home control readability — 2026-09-23

Home's Date, Search, Shuffle, Save, count/avatars, and Expand surfaces are now 22px. Save/count labels use 10/12px, date 12/14px, and Last edited 12/12px. Search/Shuffle glyphs are 14px; retain original icon shapes. This explicit size request supersedes the former 20px Search/Expand sizing lock. Daily top-row-to-image gap is 10px. Preserve the 1px title/creator gap using -2px block margins on the 22px actions and a 1px creator margin. Technical information and creator-card headings are 16/20px, default details/body 14/18px. Noh Mask displays Theater/Teatro while the internal Performance ID remains compatible. Checks: `../qa/home-control-scale-2026-09-23/verification.md`.

On Daily and opened artwork details, keep the title 8px before the fixed Save controls. With a one-line title, keep creator/date in that left column. When the title wraps, let creator/date use the full width below the controls. Keep a short date together when it fits. Verification: `../qa/conditional-metadata-wrap-2026-09-23/verification.md`.

## Selected Explore layout — Compact browse, 2026-09-23

- Julio rejected the six later experiments and selected the earlier **Compact browse**. It is now the normal Explore layout: Search → Discover something new → Gallery → compact collection cover shelf → Explore by category.
- Reuse the preserved Compact browse component, exact card sizing, typography, spacing, and shared Search/category behavior. Keep the three-column Gallery and portrait cap.
- `DiscoverScreen` defaults its local visual variant to `compact-browse`. The root study flag remains null on the normal route, so ordinary preferences and saves retain their normal persistence. Explicit study queries remain temporary; the saved first-round comparison remains `/explore-saved.html`.
- This selection supersedes the second- and third-round experiment directions below. Verification: `qa/compact-browse-selected-2026-09-23/verification.md`.

## Reading typography trial — 2026-09-23

Julio requested +2px for artwork title/creator, category labels, and description. Shared TodayArticle defaults now use title and creator 16/18px, description 14/16px, and categories 10/12px with unchanged 2px 6px padding. Category height is 16px, up from 14px. The single-line title-to-creator gap is 1px, using a -1px creator top margin alongside the 20px action row. Preserve actions, image geometry, other spacing, and Large/System settings. This supersedes previous default reading sizes. Checks: `../qa/reading-type-2026-09-23/verification.md`. Visual acceptance is pending.

## Compact Explore concepts, third round — 2026-09-23

- Julio rejected the second-round magazine, room, and index options. Both their typography and layouts felt outside Taste's design system. Do not treat them as the active direction. Compact browse remains the preferred saved baseline, not the default.
- `http://127.0.0.1:4173/explore-study.html` now compares **Gallery & collections** (`switchboard`), **Collection filters** (`lenses`), and **Connected gallery** (`stream`). The first switches between Gallery and Collections with shared underlined tabs; the second filters Gallery in place using compact collection covers; the third places compact collection links between groups of artworks.
- Use established 16/20 regular section labels, 12/16 controls and collection titles, compact metadata, shared semantic colors, three-column Gallery crops and spacing. No editorial mastheads, exhibition-wall compositions, large concept headlines, or enlarged promotional cards in these options.
- Keep Search, Categories at the end, normal app behavior, and the saved Compact browse design. New concepts retain their local choice during category/search filtering and artwork/collection overlays. The first-round comparison remains `/explore-saved.html`; all previous direct study routes remain available.
- New sources: `ExploreSwitchboard.tsx`, `ExploreLenses.tsx`, `ExploreStream.tsx` and their scoped styles. Handoff: `qa/explore-compact-concepts-2026-09-23/verification.md`. These are new experiments for review, not selected defaults.

## Create artwork flow — 2026-09-23

- Create is a four-step local artwork flow: artwork, optional images, details, and review. Artist search opens on focus, matches aliases, and shows individual records with identifying details. The sourced reference examples include Caravaggio and two Pieter Bruegels. Custom and unknown artist choices remain available.
- Use **Artist** and **Title** labels. Each has an **I don't know...** choice. The title example placeholder is not a saved value. Require the artist/title or their unknown choices, one of the seven editorial art forms, and context; keep year, format, and sources optional. Create does not collect physical dimensions.
- Keep the progress indicator and its accessible step count. Images shows the **Add images** heading, file guidance, and upload control. Details shows its fields directly. Review keeps its heading, cards, and Edit actions. Remove the repeated step-count line and intro on those three steps, the duplicate image label, the Details dimensions section, and the Review disclosure. Completion still explains the local-only outcome.
- The Images heading-to-guidance gap is 12px. Space the Details **Optional** hints from their labels. Review cards keep 44px Edit targets with compact top spacing. One uploaded image uses a full-width 3:2 preview without cropping; two images use two columns and three use three. Latest handoff: `../qa/create-spacing-refinement-2026-09-23/verification.md`.
- Create fields and the Art form trigger use 44px targets with 14px text; the footer button is 48px with 14px text. Unknown choices use plain 44px checkbox rows. Art form now opens an inline list beneath a trigger labeled **Art form**, with the current selection on the right and a chevron. The seven choices keep 44px rows; the selected choice has a checkmark and a white Light surface or raised charcoal Dark surface. Escape returns focus to the trigger without leaving Details; outside press closes the list. Reduced motion removes the chevron movement. Latest handoff: `../qa/create-art-form-variation-2026-09-23/verification.md`; the earlier choice-sheet pass remains in `../qa/create-design-system-2026-09-23/verification.md`.
- September 24 refinement: the Art form list has 8px corners; its selected indicator and options use 4px. The first three Create footer buttons say **Continue**. The final Review action says **Finish preview** and never implies publication. Preserve localization and validation.
- Create step content uses a short 8px exit and 14px entrance, reversing for Back and Review Edit. The full Create page enters and exits with a 16–18px shift and 220ms fade. Use the shared ease-out curve with no scale, blur, or spring. Keep header/footer fixed, the previous tab mounted but inert below Create, and restore focus after exit. Reduced motion is immediate. Handoff: `../qa/create-flow-motion-2026-09-23/verification.md`.
- Store draft text under daily-culture.create-artwork-draft.v1 and image files in the local taste-create-artwork-v1 IndexedDB database. There is no top-right Save & exit action. Closing restores the current step on return. Comparison-study query routes use temporary state and cannot read or write the main Create draft.
- The final state is a local preview. Nothing is transmitted, published, or added to Library. The separate Daily **Suggest a story** sheet remains unchanged.
- Source: src/Prototype.tsx, src/prototype.css, src/create-artist-directory.ts, src/create-artwork-storage.ts. Tests: tests/create-artwork.spec.ts. Handoff: ../qa/create-artwork-flow-2026-09-23/verification.md. Visual acceptance remains Julio's decision.

## Home icon and Daily shuffle — 2026-09-23

- The top-left Daily control is **Shuffle artwork**, replacing the proposed header profile avatar and superseding earlier no-shuffle instructions. Select only a different existing featured edition; exclude the contribution invitation. Keep the edition date, chronological gestures, and keyboard navigation.
- Use a 180ms opacity fade with no movement, immediate reduced-motion updates, and destination focus. The shared 12px shuffle glyph sits in a 20px visible circle; coarse pointers get a 44px target and top row.
- Home now uses the shared lower-roof house silhouette with continuous walls and a doorway. Preserve 20px menu icons, 44px targets, current selection animation, and the exact Home Search and Expand glyphs. Verification: `../qa/home-shuffle-2026-09-23/verification.md`. Visual approval is pending.

## Onboarding preview — 2026-09-23

- The workspace picker has a fourth choice, **Prototype / Onboarding**, at `http://127.0.0.1:4173/?view=onboarding`. Keep the normal Prototype as the default; onboarding must not replay during routine prototype review. The future product can place this flow before Daily, but the current local preview stays separate.
- The sequence is an artwork-led value proposition, preview-only email/Apple/Google/Facebook continuation, a daily reminder choice, the seven Explore art categories, then a finish action opening Daily. Use the existing category names/images, not Goodreads genres or the unrelated Medium filters.
- Welcome paintings fill the phone behind the status area and crossfade every seven seconds among Girl with a Pearl Earring, The Kiss, and a portrait of Dante. Pause cycling for email entry and policy sheets; disable it under reduced motion. Keep the increased subtitle size and omit the image credit on this screen.
- Reminder choices use the existing 08:00, 09:00, and 18:00 Settings values, plus **Not now**. Finishing saves the notification preference to the existing key. Category choices save to `taste.onboarding.interests.v1`; they do not personalize the editorial Daily selection yet.
- The Apple, Google, and Facebook buttons use recognizable black provider marks on white pills in both themes. Terms and Privacy links and the email arrow use muted gray. Email focus uses a soft inset cue. Interest cards keep seven choices and use Explore's square top-left background labels; the explanatory note below the grid is removed. Keep selection circles and the Finish requirement.
- Apple stays at 22px; Google's mark renders at 88% and Facebook's at 98% of that size. The reminder step has a compact title, two short lines about daily practice and choosing a notification, and a **Daily artwork / The Death of Socrates (1787)** preview. The redundant notification disclaimer is removed. The interests step is **Favorite art forms** with no subtitle and fits without scrolling on the supported iPhone and Pixel 10 previews. Back has a 32px visible circle inside a 44px target, with a 14px caret.
- Authentication and native notification delivery are not connected in this web preview. No Taste Terms and Conditions or Privacy Policy exists yet; the welcome footer identifies them as in progress and opens informational sheets. Keep those limits visible. Preserve the protected phone runtime, four locales, Light/Dark, device safe areas, and the current five-item in-app menu.
- Sources: `src/OnboardingFlow.tsx`, `src/onboarding.css`, `src/design-system/DesignSystem.tsx`, and `src/Prototype.tsx`. Verification: `../qa/onboarding-2026-09-23/verification.md`. Visual acceptance remains Julio's decision.

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
- Settings: retain only Theme's bottom divider above About Taste. `.settings-secondary-menu` keeps its 30px margin and transparent 1px top border, preserving spacing while removing the duplicate visible line.


## Account, profile, and folder refinements — 2026-09-23

- Profile header actions: usernames use **15px/20px**. Show **Share profile** under the current reader's handle, using the same native-share/clipboard path as Settings. Other local sample accounts show the shared **Follow / Following** control instead. Account identities in Search and the owner's Following list open a separate retained profile layer; Back/Escape restores source focus and state. Keep 12px above and below the action, 4px button corners, and 44px coarse-pointer targets. Sample profiles have explicit empty artwork/folder/following lists; never show the owner's saved data there. Only the current reader's local Follow edge changes that sample's follower count. Profile folder covers use **4px** corners.
- Latest profile compaction: use a **56px** portrait with **8px** corners in the Profile hero and Settings account card, **12px** from the header action to stats, a **64px** stats row, and **8px** shared page gutters with **12px** above the two-column content. Remove repeated section headings; retain the actual folder title when opened. Slide the single underline over **260ms** and fade changed tab content over **180ms**, with no initial animation and immediate reduced-motion changes. Preserve native tabs, focus, folder/detail return, and counts. Settings account cards use **8px** corners with **4px** action-button corners.
- Latest size/spacing correction: all five icons in the selected Light glass menu use **20 × 20px** with unchanged **44 × 44px** targets. Remove profile-only enlargement in both active and inactive states; comparison menus also use the same size for all five icons. On Home only, Technical information → creator card uses a **20px** gap, increased from 16px. Preserve the glyph, other menu geometry, and other reading gaps.
- Settings has equal **View profile / Share profile** buttons. Share uses the device share menu with clipboard fallback and a clean local `?profile=current-prototype-reader` route. This is a profile preview, not a public account service. Keep successful share, cancellation, copied, and failure feedback distinct. Settings chevrons occupy the final grid column, including rows without a secondary value.
- The bottom-menu Settings destination now uses the original shared geometric **user** glyph, with outline/filled states and existing 160ms opacity activation. This supersedes the menu-photo requirement. Keep the actual portrait in account cards and profiles.
- Profile stats use the page background with a thin active underline; remove the black band and top-right gear. Show the current prototype handle **@juliocaggiano** beneath the name. Artworks uses two columns of fixed 4:5 images. Folders uses two columns of rounded cover cards with name and actual save count; opening one shows its artworks and **Back to folders**. Preserve detail return, focus, saved data, and zero inbound followers.
- **New folder** uses the shared tall sheet in Library and artwork Save menus: cover selection, a 50-character name, Create at top right, Private folder, Hide from feed, and sample collaborator selection. Store optional metadata without changing overall saves or memberships. Cover selection alone does not add a work. Privacy/visibility are local prototype preferences; selecting sample collaborators sends no invitation. Preserve cancel/discard, keyboard behavior, themes, all four locales, and protected runtime files.
- This update supersedes earlier profile black-bar, gear, circular profile-folder, menu-avatar, and single-action account-card guidance. The Library's own circular folder rail remains. Handoff: `../qa/account-folders-refinement-2026-09-23/verification.md`; visual approval remains Julio's decision.

## Profile and Settings — 2026-09-23

- Settings uses a single **Your account** header, Julio's supplied avatar/name, live saved-artwork and folder counts, and a **View profile** action. Place one **Settings** heading above existing rows and preferences. The final menu order is **About Taste · Version 1.2**, **Rate App** without a leading star, then **Legal** last. Preserve the current sheets, localization, persistence, 20px inset, and phone scroll.
- `ProfileScreen.tsx` has four keyboard-accessible stat sections: Artworks from global saves, Folders from personal boards, Following from locally followed sample people, and Followers from a supplied inbound list. The local prototype supplies an empty inbound list, so show 0 and an empty state; do not substitute saved-by sample counts. Artwork previews open shared detail/Edit and return to the retained profile with focus. Back and gear return to Settings.
- Keep the supplied Julio portrait with initials fallback, shared theme tokens, PP Neue Montreal, original `Gear` glyph, protected device chrome, and reduced-motion behavior. Do not invent a location, self-follow state, auction prices, or a shareable profile URL. Handoff: `../qa/profile-settings-2026-09-23/verification.md`; visual approval remains Julio's decision.

## Saved-reference Library — 2026-09-23

- Use only **Artworks / Folders** in the Library header. Artworks includes all global saves. Folders lists the existing personal boards under localized folder names, plus New folder; selecting one filters the two-column artwork grid. The old Favourites Pieces/Creators/Places tabs are superseded.
- Keep the 20px Library gutters, 52px full-width tab row, 92px circular folder covers, two-column image grid, PP Neue Montreal, theme tokens, and protected phone areas. Cards open `PieceDetail` using the shared `TodayArticle`; the Library-only top-right **Edit** sheet changes folder membership and a private note. Back restores the retained Library state and focus.
- Preserve `today-boards.ts` save state, migration, and storage keys. A global save can be in zero or multiple folders. Notes persist separately through `library-notes.ts`; do not edit canonical artwork metadata. Folder creation and Edit use `BottomSheet` and keyboard-aware fields. Check both phone previews, light/dark, all four locales, Escape, focus, and reduced motion.
- Source: `src/Prototype.tsx`, `src/prototype.css`, `src/library-notes.ts`. Handoff: `../qa/library-redesign-2026-09-23/verification.md`. Visual approval remains Julio's decision.

## Search scopes and compact refinements — 2026-09-23

- Search section/gallery headings use **16px / 20px**, weight **400**, and zero tracking in PP Neue Montreal, matching Home's **Check out more**. `.discover-gallery-grid` uses **three equal responsive columns** with 4px gaps. Its images use `width: 100%; height: auto` with a `125cqw` maximum height and cover cropping at the recorded focal position; keep list view's later 64 × 64px image override. Source: `src/discover.css`. Verification: `../qa/gallery-three-columns-2026-09-23/verification.md`.
- **Explore by category** uses Architecture, Sculpture, Painting, Music, Literature, Theater, and Cinema as a separate taxonomy from Medium. Use two columns, 6:7 portrait cards, 8px gaps, 4px corners, and 16/20 semantic top-left labels inset 10px. Preserve focal positions, localized category labels, Back/Escape and source focus/scroll. No live works means an honest empty state; held batch records remain unimported. Category cover provenance: `public/assets/categories/README.md`.
- Keep **Artworks / Artists / Accounts / Medium** visible in merged Search before and during typing. This replaces the old query-only field filters. Artists uses actual creator records, opens existing artist profiles, and shares **Save / Saved** state. Accounts searches the 65 existing fictional peers by name/handle, labels them **Sample profiles**, and reuses social **Follow / Following** persistence.
- Show the secondary All/media selector only under **Medium**. Query and medium narrow results together; editing or clearing text retains the chosen medium. A primary-scope change clears hidden medium/shortcut filters. Hide **Show all** when the current result count is zero. Preserve Home search, compact field dimensions, 8px outer gutters, and return navigation.
- `.discover-page` keeps **64px** top padding, increased by 8px. Julio reverted the extra 2px on `.discover-field-filter-rail`; the field-to-primary-selector gap is **8px** again. Keep the secondary Medium gap at 8px.
- Unknown creators display localized **Unknown** through `localizePiece`; English library patterns match. Retain original IDs and records. User-facing save destinations use localized **Choose folder / New folder / My folder** wording while preserving custom names, saved memberships, and legacy storage keys.
- Scope the smaller profile image to `.bottom-nav-item .today-saver-avatar`: **20 × 20px**, with no border, outline, or shadow ring. Keep its **44 × 44px** target/selection and other avatars unchanged in both themes.
- Source: `src/Prototype.tsx`, `src/SearchEntities.tsx`, `src/search-entities.css`, `src/discover.css`, `src/today-savers.css`, `src/today-boards.ts`, and `src/design-system/patterns.tsx`. Handoff: `../qa/search-entities-refinement-2026-09-23/verification.md`; it records verification separately from Julio's visual approval.

## Save artists — 2026-09-23

- Artist biography cards, artist profiles, and the design-system showcase use **Save / Saved**. Localize visible labels, accessible names, and removal actions in all four locales. This supersedes earlier artist Follow / Following wording.
- Use the artist save copy in `ArtworkInformationSection.tsx` and `Prototype.tsx`; retain the existing creator state and `daily-culture-followed-creators-v1` key for compatibility. Keep social people’s **Follow / Following** copy and separate persistence unchanged.

## Search return navigation — 2026-09-23

- Filtered shortcut/category galleries, including Our picks → Most loved, show a localized Back arrow and their current section title. Back or Escape restores the browsing position and opening control. Plain text queries retain Clear and Show all.
- Keep Discover and collection pages mounted while an artwork covers them, with `inert`, `aria-hidden`, and hidden visibility. Artwork Back/Escape returns to its collection when applicable; collection Back/Escape returns to Search. Restore source focus after the parent becomes interactive.
- Preserve the selected field filter, query, gallery layout, scroll position, and Home’s existing return behavior. No new page transition is added.
- Source: `src/Prototype.tsx` and `src/discover.css`. Verification: `../qa/dark-system-2026-09-23/verification.md`.


## Charcoal dark theme — 2026-09-23

- Use the five `darkPalette` values in `src/design-system/tokens.ts`: `#171717` canvas, `#262626` surface, `#333333` raised surface/divider, `#a3a3a3` muted text, and `#f2f2f2` primary text. Selected capsules use `#171717` on `#262626`. This replaces the prior dark mapping; preserve Light and existing compact sizing.
- Julio liked the dark direction and requested more transparent menu glass, with Savee as an additional reference. The dark bottom menu now uses a 72%-opacity surface, superseding 82%. Keep 16px blur, an 8%-opacity soft-white border, and a 4%-opacity inset highlight. Inactive icons use soft white at 70% opacity for readability; selected icons use full-opacity soft white on the dark canvas. Reuse semantic tokens across the prototype, library, and generated exports rather than adding solid grays.
- Scope the compact-menu geometry to `data-menu-study="light"`, which is the default in both themes. Keep 248 × 52px and fixed 44 × 44px targets, with 3px padding plus the 1px border producing equal 4px visible edge insets. Distribute horizontal space between targets and keep the existing selection animation. Preserve the solid/outline study geometry.
- Preserve the full-screen artwork viewer's existing image-specific black/white glass and protected device chrome. Initial theme checks: `../qa/dark-system-2026-09-23/verification.md`. Latest refinement handoff: `../qa/menu-glass-refinement-2026-09-23/verification.md`. The latest refinement awaits Julio's visual review.

## Shared Home and Search gutters — 2026-09-23

- Use `.daily-culture-app`’s `--app-page-gutter: 8px` for `.today-article` and `.discover-page`. Search’s earlier 4px outer gutter is superseded. Its existing 4px nested insets put field/headings 12px from the screen edge, matching Home’s reading text.
- Preserve the separate 20px content insets on Library, Settings, Create, collections, and creator reading. Full-width creator imagery remains deliberate. Artwork details inherit Home’s shared gutter.
- Handoff: `../qa/page-gutters-2026-09-23/verification.md`.


## Bottom-menu Search refinement — 2026-09-23

- Remove the merged Search/Discover page's small upper art-form chip rail. Retain the query-only All / Places / Art forms / Creators selector, existing category tiles, browse shortcuts, and Show all.
- Use a 32px search field with 14/20 input text, 16px search/clear icons, and a 24px clear target for fine pointers. Coarse pointers retain a 44px field and clear target. Keep the field height stable before and after typing.
- On text changes, reset browse-only `form` and `selection` to `all`; Clear also resets `query` and `filter`. Preserve Today's separate expandable search and protected Home search icon.
- Source: `src/Prototype.tsx` and `src/discover.css`. Handoff: `../qa/discover-search-2026-09-23/verification.md`. Build and focused interaction checks passed. Visual approval remains Julio’s decision; consult the handoff for evidence.

## Artwork details aligned with Home — 2026-09-23

- `PieceDetail` reuses `TodayArticle` to match Home's 420px hero, PP Neue Montreal, title/actions, creator/date, categories, story, Last edited, Technical information, and creator panel. Keep the 56px section gap. Omit the brand masthead, tagline, and current Daily date from details.
- Detail top controls are a 32px pale Back circle with a 14px `CaretLeft` and the actual art form in a 20px pale label. Coarse pointers expand Back and its row to 44px. Use `.today-article[data-reading-view="detail"]` and `.artwork-detail-scroll` for detail-specific targeting.
- Preserve root saves/boards, saved-by people, and viewer behavior through `TodaySaveActions`. Back restores the underlying view, Daily reading position, and search query. Details have no related rail; Home keeps the selected Gallery rail.
- Source: `src/Prototype.tsx` and `src/prototype.css`. Handoff: `../qa/artwork-detail-home-2026-09-23/verification.md`. This implementation awaits Julio's visual review; the handoff records completed checks.

## Prototype icons — 2026-09-23

- Use original shared geometric glyphs in `src/design-system/PrototypeIcons.tsx` for the prototype's app-owned navigation and actions. Julio requested subtle Cursor-inspired refinements. Preserve existing sizes, button layout, accessible labels, active states, the menu's 160ms opacity fade, and like/follow interactions.
- Leave the homepage Search button's original 12px Phosphor MagnifyingGlass and the homepage Expand button's exact Paper SVG unchanged, including their 20px control dimensions and styles. Keep photos/initials as profile avatars and preserve all protected mobile-runtime icons. The Process documentation icon selection is separate.
- Current handoff: `../qa/prototype-icons-2026-09-23/verification.md`.

## Selected Gallery rail and section spacing — 2026-09-23

- Julio requested the creator-card → Check out more gap match Last edited → Technical information. Both now use `--today-section-gap: 56px` on Today. Live measurements found the former was 40px and the latter 56px. Keep the reference gap unchanged; this supersedes the earlier 40px related-section margin.
- Julio selected **Gallery rail** (`gallery`) as the default Check out more layout. Use unboxed 208 × 156px images, compact captions, and a 12px rail gap. This supersedes the earlier filled cards. **Paired grid** (`grid`) and **Compact list** (`list`) remain available with Gallery rail at `http://127.0.0.1:4173/related-study.html`.
- Use explicit `related-study` query parameters for the comparison. Preserve existing related-work selection, localized titles/creator/date, image focal positions, theme tokens, PP Neue Montreal, and protected Carousel/MobileScroll behavior. Opening a work retains Today and its reading position for return.
- Comparison previews start near the related section, with same-origin View section/Reset controls. Study saves, preferences, collections, and follows remain temporary. Do not treat a study or test as visual approval.
- Source: `src/RelatedWorks.tsx`, `src/related-works.css`, `src/Prototype.tsx`, and `src/prototype.css`. Handoff: `../qa/related-works-2026-09-23/verification.md`.

## Today search variations and profile avatars — 2026-09-23

- Profile avatars use an uploaded photo when available, otherwise two initials. Never substitute a person-outline icon. `SaverAvatar` supports `avatarUrl`, with initials on missing or failed images. The current reader uses Julio’s supplied portrait, compressed to a 256 × 256 WebP at `public/assets/profile/julio-avatar.webp` in the app. JC is the image-failure fallback; its people-sheet row still localizes You. The Settings menu avatar uses the same component. Preserve its 24px size and the original source photo. Julio requested a wider crop: use the original’s full-width upper square, keeping the head, shoulders, and hand visible. Keep the saved-by count pill above overlapping avatars with an opaque fill in both themes. This supersedes the earlier silhouette placeholder.
- Today's top Search now opens search within Home. It has independent query state from the bottom Search/Discover destination. Keep DailyPager mounted under search and result details, with its edition and reading scroll intact; closing an artwork returns to the same query and results. Dismiss search to return focus to the original icon.
- Compare three unselected explorations at `http://127.0.0.1:4173/search-study.html`: **Expand in place** (`inline`) grows the 20px icon into a 32px field with compact results over the artwork; **Focus view** (`focus`) adds a full search surface and two-column artwork results; **Search sheet** (`sheet`) uses the protected rounded BottomSheet with search near the keyboard. Explicit `today-search-study` query parameters select variants. Inline is the working default pending Julio's choice, not a recorded selection.
- Use a 320ms width expansion with restrained 180–200ms fades; reduced motion removes movement. Keep PP Neue Montreal, monochrome tokens, soft search-field focus, and keyboard focus cues. Search/Discover's earlier black focus stroke is replaced with a 16%-opacity medium-gray inset stroke.
- Use KeyboardInput. Keep overlays and results above the visible keyboard and outside protected status/navigation regions. Defer sheet keyboard dismissal until result/close clicks run, so the sheet cannot move away from the pressed target. Preserve Escape, clear, empty results, text entry, and all four locales.
- Search covers the existing localized artwork titles, creators, places, forms, context, and stories. No remote search service is added. Search-study preferences, saves, boards, collections, creator follows, and people follows remain temporary; comparison controls use same-origin parent messages only.
- Source: `src/TodaySearch.tsx`, `today-search.css`, `Prototype.tsx`, `TodaySaversSheet.tsx`, and `public/search-study.html`. Handoff: `../qa/today-search-2026-09-23/verification.md`.

## Sprint foundation and prompted updates — 2026-09-23

- Sprint plan shows only **References · previous sprints** in its reference area. Omit sprint names, point totals, and empty-state copy there. Remove task-card profile pictures and initials; keep the date left-aligned. This supersedes earlier reference-value and card-avatar guidance below.
- `src/scrum/projectUpdates.ts` contains immutable, append-only reviewed batches. `src/scrum/model.ts` applies each batch once to new and saved boards. Preserve personal edits, existing epic codes, and task order. Retain the original August 31–September 13 and September 14–27 sprint dates.
- Julio will request ticket creation and movement verbally. Check the current request, relevant chats, and source evidence, then append a guarded update for that authorized change. Do not replace browser data with seed records or claim automatic chat synchronization.
- Mark Done only for the stated verified artifact or submission receipt. Approval, publication, grades, and reader outcomes require separate evidence. Do not invent participant results.
- Handoff: `../docs/SCRUM_WORKSPACE.md`. Verification: `../qa/sprint-foundation-2026-09-23/verification.md`; read the record for completed checks and limits.

## Saved-by interaction and reading spacing — 2026-09-23

- The two circles now represent the latest sample savers. The avatar/count group is one native button opening a phone-scoped saved-by sheet. It does not save the work. Use neutral monogram avatars until real profile images exist. The current prototype reader appears first after saving and has no Follow action.
- The sheet adapts Julio's Savee screenshot with a handle, centered count heading, scrolling people rows, and shared Follow buttons. Use 24px upper corners, 20px insets, 40px avatars, 60px rows, 16/20 heading, 14/18 names, and 12/16 handles. Retain Light/Dark, all four locales, safe areas, Escape/overlay/handle dismissal, focus restoration, and reduced motion.
- Records are fictional and the sheet says **Sample profiles**. Socrates shows all 65 sample peers, or 66 including the current reader. Other larger sample counts show at most 65 peers. People follows use `daily-culture-followed-people-v1`, independently from artwork saves and creator follows. Study routes remain temporary. This is a local prototype, not authenticated social activity.
- Save rolls only changed count digits upward over 240ms; unsave reverses direction. Keep the plus sign and unchanged digits still. Rapid reversals settle on the latest count. No mount animation; reduced motion changes immediately. Preserve 8/10 proportional typography, zero tracking, and 20px action surfaces. Leave the full-screen control and selected Light glass menu unchanged.
- Latest spacing correction: default Socrates title-to-creator line-box gap is **2px**, final paragraph-to-Last edited gap **24px**, and Last edited-to-Technical information gap **56px**. The title correction uses a -2px creator top margin after the 20px action row. The Last edited text uses the existing medium text tone at 60% opacity, making it the faintest reading text without adding a solid palette swatch. This supersedes earlier spacing values below.
- Source: `src/TodaySaveActions.tsx`, `TodaySaversSheet.tsx`, `today-savers.ts`, their CSS, and `prototype.css`. Handoff and checks: `../qa/today-savers-motion-2026-09-23/verification.md`. Visual approval remains Julio's decision.

## Today saves and boards — 2026-09-23

Julio's Paper node 1TC-0 supplies the two overlapping red circles, `+count` pill, text-only Save/Saved split control, divider and chevron, and separate expand circle. The current row uses 20px surfaces and 8px group gaps to match the date and Search controls above the artwork. The `+count` and Save/Saved labels both use 8px/10px typography; the count uses proportional numerals, normal kerning, and zero tracking after Julio found the `65` too widely spaced. Leave the expand control unchanged, with Paper's diagonal `open_in_full` path at about 5px inside its 20px circle. Preserve PP Neue Montreal, accessible labels, saving/board/viewer behavior, localization, and dark mode. These compact controls remain a scoped exception to coarse-pointer expansion on this exact Today row. Handoff: `../qa/today-actions-paper-2026-09-23/verification.md`.

`Prototype.tsx` now places a live edition date and Search action above Today's 377 × 420px artwork. `TodaySaveActions.tsx` replaces the Today heart control with a sample saved-by-people count, split Save/board picker, New board sheet, and full-screen action. `today-boards.ts` validates and persists global saves separately from personal board memberships while migrating the legacy favourites key. Keep the existing image viewer, chronological carousel, local storage compatibility, four locales, monochrome PP Neue Montreal styling, and protected runtime. Do not add the Paper shuffle action under the earlier no-shuffle decision. The count is prototype sample data, not real adoption. Handoff and visual captures: `../qa/today-save-2026-09-23/verification.md`.

## Selected floating menu — 2026-09-23

The old labelled full-width menu is superseded by five icon controls in an inset capsule. Julio selected the refined Light glass option as the new menu. Its 248 × 52px geometry and 16px blur are the base `.bottom-nav` style. Light uses a 24%-opacity white border and 18%-opacity inset highlight; Dark uses the charcoal treatment above. The latest spacing correction uses fixed 44 × 44px targets and equal 4px visible insets at both capsule ends and above/below the selected circle. `public/menu-study.html` keeps the unchanged solid and outline variants for comparison through explicit `menu-study` query parameters. The five destinations are Daily, merged Search/Discover, an undesigned Create placeholder, Favourites, and Settings through a profile photo or initials. Discover browse state and the old Search field filters live together in `Prototype.tsx`. Keep the menu outside `MobileScroll`, above device controls, hidden during keyboard and detail states, with reduced-motion behavior. See `../qa/floating-menu-2026-09-23/verification.md` and `../qa/menu-glass-refinement-2026-09-23/verification.md`.

## Taste naming and process refinement — 2026-09-23

Use **Taste (V1.2)** for versioned project labels and metadata, and **Taste** for the visible wordmark. `src/brand.ts` supplies shared name/version/label constants and legacy prose display replacement. Localized copy, accessible names, browser titles, library headings, and new download names use the current brand. Keep legacy storage keys, internal IDs, CSS prefixes, source filenames, service labels, and historical evidence unchanged. The shared top bar reads **Taste (V1.2) / Project Management**.

Process documentation removes Export/Import controls while retaining local storage and legacy data validation/migration. Sprint plan has an editable **Sprint name**, no date/status subtitle, and **References · previous sprints** derived from completed-task story points in earlier closed sprints. Preserve actual sprint dates and two-week scheduling. Do not present those estimates as measured velocity.

Reflection belongs in the separate optional **Retrospective**, available for closed sprints and after **Complete sprint**. It does not appear when planning or creating a sprint. Completion occurs immediately and returns unfinished tasks to the backlog; cancelling the retrospective does not reverse completion. Preserve saved reflection and original note fields.

Use installed Motion for Process transitions: search focus and clear control 150ms, views 180ms crossfade, active underline 250ms, and dialogs 200ms. Keep 4–8px corners, subtle monochrome feedback, usable keyboard focus, and immediate reduced-motion states. Do not change the chosen creator Slide back motion or protected runtime. Handoff: `../docs/SCRUM_WORKSPACE.md`; verification record: `../qa/taste-refinement-2026-09-23/verification.md`. Read the record for completed checks; this instruction is not a browser-verification claim. This update supersedes older backup controls and Reflection-in-plan instructions below.

## Process documentation and epic codes — 2026-09-23

The browser workspace is now **Process documentation**; retain `?view=scrum`, `daily-culture-scrum-v1`, and existing source filenames. Keep the Scrum explanation in About. The board and status controls have **To do**, **In progress**, and **Done** only; normalize legacy `review` tasks to `in-progress` on load and import.

`src/scrum/model.ts` assigns existing tasks by content to Product Design (PD), Engineering (ENG), Editorial (ED), User Research (UR), and Capstone Planning (CP). Display codes such as `PD-001` without replacing internal IDs or saved edits. Preserve task order and existing codes. Increment the destination epic counter only when saving new work or changing its epic. Task details offer **Epic** and **New epic…** with name/prefix fields; cancel must leave both tasks and epics unchanged. Preserve version-1 backups and normalize old imports before committing them.

Default sprint names are **Sprint 1** and **Sprint 2**. Migrate only their exact original seeded names; preserve custom names. The shared top bar stays 44px high, with space for the longer workspace label and responsive truncation of the center project title. Handoff: `../docs/SCRUM_WORKSPACE.md`; verification record: `../qa/process-epics-2026-09-23/verification.md`. This supersedes the older workspace naming and four-stage workflow below.

## Creator profiles and navigation correction — 2026-09-22

`CreatorDetail` in `src/Prototype.tsx` and scoped `src/creator-profile.css` implement the supplied creator reference. Preserve its 275px full-width cover hero, 28/32 identity, 20px reading insets, 16/26 prose, three equal underlined tabs, and 214px square artwork cards. Overview, Biography, and Artworks are functional; retain keyboard tabs, shared Follow persistence, real counts, saved-work filtering, and title sorting. Share is removed. Use one 104 × 32px minimum Follow control with 4px corners, dark Follow and outlined Following states, retaining 44px coarse-pointer height. Back has a 24px square and 16px chevron inside a 44px target. Cards show title, then creator/year, in normal case without a medium label. A single decorative 1px underline slides across the three equal tabs over 260ms; reduced motion removes that transition. Latest checks: `../qa/creator-refinement-2026-09-22/verification.md`. Unknown makers use Period rather than Lifetime. Preserve all four locales, reader sizes, themes, and protected runtime.

Julio rejected the earlier rounded icons and bounce. `NavigationIcon.tsx` now uses restrained 24px outlines and solid filled active states for house, compass, magnifier, heart, and gear. Activation is a 160ms opacity fade only; no mount animation or transform. Reduced motion snaps. Keep existing labels, hit targets, and menu geometry. Handoff: `../qa/creator-reference-2026-09-21/verification.md`.

## Discover and menu refinement — 2026-09-21

Discover follows measured Paper node 1UV-0, using `src/discover.css`: 4px insets, 243 × 182px collection images, 2-by-2 discovery tiles, four-column gallery, and real category filters. Keep the existing content, PP Neue Montreal, semantic grays, protected Carousel/KeyboardInput/MobileScroll, and four locales. Browse state survives detail navigation. Do not restore visible Daily Culture/Discover headers. The earlier rounded menu icons and 260ms settle are superseded by the September 22 navigation correction above.

Latest spacing request: add 16px at both marked Daily section boundaries. Reading bottom padding is now 48px; Check out more top margin is 40px. Preserve the separate 16.5px metadata-to-story gap. Handoff: `../qa/discover-paper-2026-09-21/verification.md`.

## Related cards and Discover cleanup — 2026-09-21

Check out more uses the existing Carousel with 208px cards and uniform 208 × 156px image crops. Preserve each image's focal position. Cards have 8px corners/gaps, semantic surfaces, 14/18 titles, 12/16 creators, and 11/14 dates. Keep native buttons, localized names, existing selection/navigation, and gesture ownership. Remove the visible Discover header, preserving the localized main landmark and featured collection. Handoff: `../qa/related-cards-2026-09-21/verification.md`.

## Reading and viewer refinement — 2026-09-21

Latest correction: remove the divider between the category labels and story text, and reduce that gap by 16px total. Reading top padding is 0; metadata bottom padding remains 16.5px. Do not restore the earlier Paper divider here.

Latest user correction supersedes the 16px viewer captions below: title and creator/date now use 14px / 18px, with the same bottom-left anchor and 2px gap. Close and download have 35.2px visible glass circles, 20% smaller than 44px, inside unchanged 44px touch targets. Icons also shrink 20%. Preserve the current glass alpha, opening crop, native image tiles, and gestures.

Keep 48px after the Last edited line before Technical information, following the latest spacing increase. Remove the divider above that section, retaining its heading underline and card borders. Remove the source and editorial-project boilerplate from Daily and artwork reading screens; preserve source/rights/ownership records in data and documentation. The Death of Socrates analysis uses exactly four sentences in two paragraphs, localized across all four languages. This sentence limit applies to this entry, not every story. Current handoff: `../qa/daily-editorial-2026-09-21/verification.md`.

## Compact toast — 2026-09-21

Keep the app toast at 30px with 12/16 type and 7px × 12px padding. Julio requested restrained Emil Kowalski-inspired motion: 6px rise, .96 → 1 scale, and 2px → 0 blur with a 220ms entrance and 160ms exit. Keep message content separate from visibility so exit does not collapse its width. Repeated notifications reset the 1.8-second timer; clean it up on unmount. Preserve localized copy, themed colors, polite announcements, and reduced-motion handling. Handoff: `../qa/compact-toast-2026-09-21/verification.md`.

## Follow button motion — 2026-09-21

Latest correction: Follow and Following use the shared divider color for a softer resting border. Hover/press borders match the inverted fill. Keep text, checkmark, focus, size, and motion intact.

Use `src/design-system/FollowButton.tsx` in creator cards. Pass both translated labels so the button reserves one stable width. Keep the native click path, `aria-pressed`, monochrome focus, reduced-motion handling, and parent scroll-drag suppression. The label transition and checkmark must be interruptible with no state delay or animation on mount. Handoff: `../qa/follow-interaction-2026-09-21/verification.md`.

## Stable counts and three-gray palette — 2026-09-21

Latest correction: counted `LikeButton` instances hug the natural tabular-numeral width with kerning disabled. Equal-length counts stay stable; a ResizeObserver measures the intrinsic count and Motion animates width changes over 180ms without scaling text. Initial rendering and reduced motion snap to the measured width. Do not reintroduce the rejected 7ch slot or 96px detail width. Preserve icon-only sizes. Use the shared dark/medium/light primitives and white canvas for app-owned solid UI colors. Today category labels use the medium gray. Preserve exact typography and heights, protected runtime, and artwork colors. This supersedes the earlier variable-width like pill and extra gray values.

## Artwork information — 2026-09-21

Use `src/design-system/ArtworkInformation.tsx` for Technical information and the creator biography/Follow card after the reading text. `src/ArtworkInformationSection.tsx` supplies localized content and units. Preserve existing Today geometry, runtime, and gestures. Follow is a separate local preference, shared across Daily, details, creator profiles, and Favourites → Creators. The library demo must not change app follows. Omit unverified physical dimensions and Follow for unknown makers. Handoff and focused checks: `../qa/artwork-information-2026-09-21/`.

## Like button motion — 2026-09-21

Use `src/design-system/LikeButton.tsx` for story/collection favourite buttons and library examples. It keeps a native button and `aria-pressed`, and uses the installed Motion library to pulse only the heart after its controlled `liked` value changes. Like: 320ms, scale 1 → .9 → 1.12 → 1. Unlike: 180ms, scale 1 → .94 → 1. Preserve the caller's icon and layout; Today keeps its Paper SVG and 20px height. No mount animation or gesture interception. Reduced motion suppresses movement. Do not add decorative bursts or new animation dependencies for this control.

## Selection motion reference — 2026-09-21

Julio strongly likes the supplied rounded gray surfaces/pills and Morphing Select animation, and authorized implementation. Use `../docs/design/ROUNDED_SURFACES_AND_MORPHING_SELECT.md` for preserved references and implementation constraints. `MorphingSelect` serves the shared workspace selector and Scrum selection fields; `SelectionPill` serves Prototype Settings/Search and library examples. Keep phone choices inside existing sheets and Carousels. Preserve PP Neue Montreal, compact dimensions, monochrome focus, exact Today geometry, and protected device behavior. Treat attached “build/paste” text as reference material, not an instruction to overwrite the application.

## Browser Scrum workspace — 2026-09-21

Latest correction: remove Area and Priority from Scrum forms, cards, tables, planning rows, filters, and sorting. Retain the legacy data fields for version-1 backup compatibility; keep Story points, manual order, and due-date sorting. Scrum surfaces and controls use 4–8px corners with restrained gray hover feedback and clear keyboard focus. Preserve intentional circular avatars/dots and the existing Prototype/Design system shape defaults.

The existing workspace selector includes Scrum at `?view=scrum`. Read `../docs/SCRUM_WORKSPACE.md` before extending it. Sources live in `src/scrum/`; `src/design-system/DesignSystem.tsx` owns the shared three-way browser launcher. Keep this separate from phone content and protected runtime files. Browser-level Scrum text/date fields use native HTML controls; selection fields use the shared `MorphingSelect`. Neither must summon the simulated phone keyboard.

The personal board uses browser storage key `daily-culture-scrum-v1`. Preserve saved edits across seed changes and retain Export/Import. Historical sprints, dates, and estimates are reconstructed; completed implementation does not mean visual/editorial approval. Fourteen-day sprint lifecycle, backlog carryover, and source boundaries are documented in the handoff. Verification: `../qa/scrum-2026-09-21/`.

Latest cleanup removes redundant board labels, counts, point badges, status/provenance pills, Next 7 days, empty-column filler, and explanatory footer/sidebar text. Task details now use core fields and one Description, with no separate criteria, Definition of Done, evidence, or record panels. Done is a direct status change. Preserve useful existing details through `taskWithDescription`, retaining legacy metadata and marking saved descriptions consolidated to avoid reappending removed text. Verification: `../qa/scrum-cleanup-2026-09-21/`.

Latest navigation: all three views share the app-owned 44px dark bar labeled **Daily Culture / Project Management**. `WorkspaceTopbar` lives in `src/design-system/DesignSystem.tsx`; app-owned CSS reserves its space above the phone without editing protected runtime files. Library search sits above sidebar navigation, including inside Browse library on narrow screens. Preserve selector focus restoration, keyboard dismissal, and URL history.

Scrum navigation is **About**, **Sprint board**, **Product backlog**. About contains one read-only description with a Scrum Guide link. Remove workspace breadcrumbs and archive navigation; include legacy archived tasks in the backlog and restore them when edited. Sprint plan has one optional **Reflection** and a separate **Complete sprint** button, with no note requirement. `sprintReflection` combines legacy planning, review, retrospective, and improvement notes until an explicit Reflection exists; preserve empty edits and the original fields. Evidence: `../qa/workspace-navigation-2026-09-21/verification.md`.

## Prototype Instructions

Earlier Settings refinement (2026-09-20): the full cultural-library card, including image and surrounding space, opens Favourites as one accessible button. Preserve scroll-drag suppression. Replace Sign In with Switch Accounts and assume onboarding handles sign-in in the intended product; the September 24 section above supersedes its informational-only preview. Story repeats now offers weekly, monthly, six-monthly, yearly, and never, in that order, with saved-preference persistence and four-locale copy. Remove the Settings brand line and footer slogan; retain its Settings heading. Evidence: `../qa/settings-2026-09-20/`.

Latest viewer correction (2026-09-20): open to Julio's second-screenshot crop, with landscape art at 72% of the phone height. The David focus is normalized x=.62, y=.5. Request native detail immediately. Render final image dimensions plus translation; do not restore the permanent `will-change` and scale combination that softened native tiles. Use a visible center-out decoded-tile reveal on fresh and cached opens. Both captions are now 16px / 20px; append the production date to the creator. The current approximate-date abbreviation is **c.**, per the newer rule above. Reduce gradient fill alpha by 20%, to 33.6% and 22.4%. This supersedes fit-on-open and the 14px caption rules below. Keep fit available through keyboard/reset and zoom-out. Evidence: `../qa/viewer-opening-2026-09-20/`.

Landscape zoom example (2026-09-20): Julio could not see the tile sharpening with Dante and requested a higher-resolution horizontal David painting. Today now uses Jacques-Louis David's *The Death of Socrates* (1787), from the Met's 4000 × 2663 public-domain original. Dante remains the preceding edition. Preserve both 14px viewer labels, existing Paper geometry, and the minimal controls. Keep visual approval pending. Latest evidence: `../qa/david-viewer-2026-09-20/`.

Latest zoom experiment (2026-09-20): Julio requested National Gallery's tiled zoom feeling. Keep the complete fitted image on open. A tap inside the viewer now zooms 1.6× toward that point with a 340ms ease-out; double-tap toggles 2.5×/fit. Visible 512px native-detail tiles refine a 768px preview with a 170ms decoded-image fade. Keep pinch, wheel, and drag direct, allow gestures to interrupt animation, and honor reduced motion. Downloads use unchanged original files. Preserve the minimal composition and full-phone canvas below. Source/asset handoff and verification: `../qa/gallery-zoom-2026-09-20/`. This is a local experiment pending Julio's visual review.

Latest image viewer direction (2026-09-20): use a black full-phone canvas. Close sits top right; icon-only download sits bottom right; title and creator sit bottom left. Controls have subtle translucent gradient fills and backdrop blur. Title and creator both use 14px type with 18px line height; preserve the existing bottom-left anchor and 2px gap. The complete image fits initially, then expands across the entire viewport behind the overlays when zoomed. Do not add visible zoom/reset controls, percentages, dimensions, help, or credits. Keep source attribution on Today, hidden accessible instructions, keyboard/gesture controls, and loading/error recovery. App-owned CSS makes native status/home indicators white only while the viewer is open; never edit protected runtime files for this. Android's protected navigation-bar region stays reserved. Evidence: `../qa/minimal-viewer-2026-09-20/`.

Latest font and image interaction decision (2026-09-20): use PP Neue Montreal across all app-owned screens, controls, sheets, image viewer, and design-system library, including Today likes and categories. This supersedes Inter/Helvetica substitutions below. Preserve existing type sizes and Paper geometry. Tap or keyboard activation of the Today artwork opens the same high-resolution viewer as the magnifier. Dragging still scrolls or changes Daily editions. Protected device chrome keeps native fonts.

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

Current visual direction (2026-09-20): compact monochrome components based directly on Julio's Paper [Search, node 1UV-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1UV-0) and [Daily, node 1QL-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1QL-0). Read `../docs/DESIGN_SYSTEM.md` for current values and adaptations. Use black, white, and gray for every UI state; artwork retains color. This supersedes September 19's blue accents and larger design-system defaults. The earlier Artsy direction remains supporting historical context. Keep bundled Inter; no licensed PP Neue Montreal files have been supplied for distribution. Do not edit Paper or imply automatic synchronization. Reference captures stay in QA, never in shipped content assets.

Latest Today correction (2026-09-20): Julio rejected the enlarged typography and controls. Default Today/Daily now follows the exact Paper sizes in the Today section below. It uses locally installed PP Neue Montreal TT Regular, including micro labels under his subsequent app-wide font decision. Do not restore the rejected adaptations.

Compact foundation outside the live Today screen: caption 10/12, label 12/16, body 14/20, section 16/20, title 20/24, display 32/40. Buttons are 32px/12px; small buttons 28px/11px. Chips are 24px/11px, with 4px control gaps. Expand controls to at least 44px on coarse pointers without overlapping targets. The 14/20 reading text and larger chip labels deliberately adapt Paper's smaller values. Use 393px pattern canvases, 4px outer and text insets, 4px gallery gaps, and 8px related-group gaps. Search follows the featured 243 × 182px rail, two-by-two discovery tiles, then four-column gallery.

Keep Geist library navigation and Preview / Code behavior while making the documentation denser. Current library dimensions are in `../docs/DESIGN_SYSTEM.md`. Use `ArtworkCard`'s optional `density="compact"` for compact examples: title/creator/context, a 4px image gap, and 2px internal gaps. Preserve default app-card geometry. `patterns.css` owns Daily/Search pattern presentation; do not restore old pattern rules in `design-system.css`. Show two pattern columns above 1000px and stack them at narrower widths, with a 393px maximum for each canvas. Shared monochrome focus propagates to the app. Verify selected-chip foreground contrast in Light and Dark. Preserve runtime, app behavior, reader options, locales, and content boundaries. v0.2 local implementation checks passed; current evidence and limits are in `../qa/design-system-monochrome-2026-09-20/verification.md`. Julio has not yet approved the visual variation.

Design system starter (2026-09-19): reusable app-owned modules live in `src/design-system/`. Read `../docs/DESIGN_SYSTEM.md` before extending them. `DesignSystemLauncher` mounts from `Prototype.tsx`; its browser-level menu and dialog do not modify the mobile runtime. Preserve shared Button/Chip styles by excluding them from generic app button resets. Edit `tokens.ts`; `npm run export:design-system` generates `tokens.css` and portable files. The production build runs this generator automatically. This initial catalog does not migrate every existing app control.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.

## Historical Today page from Paper — 2026-09-20

The September 23 Today saves and Paper action revision above supersede this section's former heart and magnifier guidance.

- Julio explicitly rejected the first implementation's typography and sizing adaptations. Use Paper's exact defaults: PP Neue Montreal TT Regular 400 at 14/16 for title/creator, 12/14 for body, and 10/10 for timestamp, each with `0.01em` tracking. Likes and categories now use PP Neue Montreal Regular at 8/10, per his later app-wide font request.
- Fonts resolve through CSS `local()` on this Mac. Do not silently replace them with Inter or bundle font files. Exact rendering elsewhere needs matching installed fonts or authorized webfonts.
- Use the 420px hero height, 4px radius, 12px image-to-metadata gap, 4px text insets, 20px action height, 14px chips, 8px action/category gaps, 16px reading gaps, and 0.5px dividers. Preserve exact Light colors and exported icon paths. General coarse-pointer expansion does not apply to these Today controls; viewer touch targets remain 44px.
- Keep explicit Large/System reader settings and Dark mode adaptations. Preserve app-owned content, navigation, and protected live device chrome.
- Julio requested the real Today/Daily page adopt his current Paper Daily layout: artwork, title with likes and magnifier, creator and production date, categories, divider, story, last-edited timestamp.
- Prefer two categories per story; never more than three. Use accurate form and historical/cultural context for the actual record.
- The artwork and magnifier both open a complete-image viewer with zoom, pan, reset, and download using the compact monochrome system. The magnifier is not a search action. Preserve keyboard opening and focus restoration, and suppress opening after a scroll or edition drag.
- Existing stories, editorial ownership, chronological gestures, related-story navigation, locales, preferences, and protected device runtime remain in place.
- Paper placeholder artwork/title pairings are not catalog metadata. `lastEditedAt` must be an actual editorial timestamp; show a localized unrecorded state when missing. Do not substitute the current time.
- Current typography/geometry evidence lives in `../qa/today-paper-exact-2026-09-20/`. It supersedes the first styling adaptations in `../qa/today-paper-2026-09-20/`; earlier functional evidence remains relevant. Implementation is local; Julio’s final visual review remains pending.
