# Taste (V1.2) project context

## Approved painting update and publication — 2026-09-27

- Applied only three requested sentence deletions: two in Saturn Devouring His Son and one in The Gulf Stream. Other 74 review bodies and all 76 image sets remain unchanged. Addressed comments moved to revision history.
- Imported Saturn and The Death of Socrates with selected image A, and updated Liberty Leading the People to its newly approved body. The app now has 20 works; its other 17 records are unchanged. Existing Goya/David biographies accompany sourced artwork facts.
- The Gulf Stream is revised but still pending writing approval. Other pending revisions do not replace older approved app records. Keep the original frozen submission package intact.
- Published to https://taste-capstone.vercel.app/ on the existing Taste Vercel team. Deployment: `dpl_CFyrE4NyfPzvBeoobrc7kdpb2VF5`. Public bundle and selected images verified against the local build.
- Fresh capture and checks: `qa/painting-approval-import-2026-09-27/`; import evidence: `docs/editorial/imports/prototype-2026-09-27-paintings/`. Incremental importer: `app/scripts/update-approved-paintings.py`.

## Ten additional painting entries — 2026-09-26

- Batch 005 adds The Milkmaid, The Night Watch, Judith Beheading Holofernes (Uffizi version), The Calling of Saint Matthew, The Surrender of Breda, American Gothic, Abaporu, The Broken Column, A Sunday on La Grande Jatte—1884 and The Birth of Venus. Each has a researched draft and three authentic local image options. All ten start pending writing review with no selected image.
- The shared review now has 65 active entries, including 28 paintings. At verification, 18 were approved and 47 required review. Existing 55 entry records and browser feedback were preserved. The normal app catalog and frozen submissions remain unchanged.
- Source files: `docs/editorial/batches/batch-005/paintings.json`, `paintings-images.json` and `research.md`. Start the new group at `http://127.0.0.1:4184/REVIEW.html#milkmaid`. Checks and visual evidence: `qa/editorial-batch-005-2026-09-26/verification.md`.


## Editorial expansion, artwork facts and restored onboarding — 2026-09-26

- Batch 004 adds five paintings (Nighthawks, The Gulf Stream, The Floor Scrapers, The Execution of Lady Jane Grey, Hunters in the Snow), five films (Good Will Hunting, Perfect Days, Cinema Paradiso, Spirited Away, Modern Times), and replacement photography studies by Dorothea Lange and Martin Parr. Each has three authentic local choices and starts pending review. The 43 retained bodies, saved decisions, notes and comments are unchanged.
- The review has 55 active works across eight media: 18 currently approved and 37 to review, including three held theater entries. Engalo and Chim remain archived but leave the active queue; Salgado, Sternfeld and Addario remain. Different photography exposures are separate photographs with individual captions, never artificial variants.
- The five older cinema drafts now also have three local image options each. No cinema images remain pending download. Four new-film frames came from ShotDeck; other choices use the recorded studio, distributor, festival or film-gallery sources. Do not describe every image as a ShotDeck download.
- Only the existing 18 approved entries remain in the normal app. New candidates need separate writing approval, an eligible image selection, resolved comments and a requested import. The frozen submission package stays unchanged.
- Sourced technical facts and short English creator biographies for the imported catalog live in `app/src/editorial-information.json` and its typed adapter. Unknown facts remain absent; translations need review. Existing approved bodies and chosen image files are preserved.
- Reading images fill their existing frame. Marat alone uses `center bottom`; the expanded viewer still shows the complete image. Onboarding restores Girl with a Pearl Earring, The Kiss and the Dante portrait from the original local assets.
- Evidence: `qa/editorial-batch-004-2026-09-26/verification.md`, `qa/artwork-details-2026-09-26/verification.md`, `qa/artwork-preview-fill-2026-09-26/verification.md`. Research: `docs/editorial/batches/batch-004/research.md`. These changes were checked locally; this task did not deploy them.

## Public review prototype and Home wheel stability — 2026-09-26

- Julio authorized publication for CP193 review. The public prototype is `https://taste-capstone.vercel.app/`; Process documentation is `https://taste-capstone.vercel.app/?view=scrum`. It uses the separate `juliocaggiano2022-8011s-projects` Vercel team, leaving the portfolio account untouched. This supersedes older no-public-deployment statements below.
- Before publication, the current local Process board was compared with the shipped board. Its 51 task records matched; Sprint 1's personally shortened goal was copied into the seed. Browser-local data does not sync between origins.
- Home retains its initial horizontal wheel axis through the full burst, including mostly vertical inertia tails. Fresh vertical wheel gestures still scroll the reading surface after idle. Preserve direction, one-edition bounds, nested rails and protected runtime. Verification: `qa/home-scroll-jitter-2026-09-26/verification.md`.
- The existing Google Doc Project Brief contains the live prototype and Process links. Julio's latest edits and 18-page structure were preserved. Its content now differs from the earlier local exports; do not present those as synchronized.

## Approved catalog imported into the local prototype — 2026-09-25

- Julio authorized the current 18 Approved-tab works for the normal prototype: eight paintings, three music entries, three books, three films and David. They replace the ten unreviewed sample records. This supersedes earlier “no app import” notes below.
- Import the exact approved body and current selected image. Music retains the vinyl composition; literature retains the rectangular cover and gray frame. September 26 correction: reading previews fill their frame with `object-fit: cover`, within the existing 420px height limit. Preserve aspect ratio, focal position and current frame dimensions; crop overflow instead of adding side bars. The expanded image viewer keeps its complete-image behavior. This supersedes the September 25 contain setting.
- App data: `app/src/approved-catalog.json` and `approved-catalog.ts`; images: `app/public/assets/editorial/`. Review evidence: `docs/editorial/imports/prototype-2026-09-25/`. Reference paths here are relative to the project root.
- Keep the 27 unapproved/held entries outside the normal app. Historical explicit comparison-study routes retain their original sample fixtures. Retired sample saves/notes/folder references stay stored without remapping to different artworks; Library shows current catalog records only.
- Approved text stays English until translations receive separate review. Do not invent creator biographies, lifetimes, physical specifications or edit timestamps for missing data. New image/form metadata must remain consistent across search, category filters, details and the viewer.
- Future review changes require a fresh requested import. The initial frozen 12-entry package stays unchanged. No public deployment occurred. Handoff: `docs/editorial/PROTOTYPE_IMPORTS.md`; checks: `qa/approved-catalog-import-2026-09-25/verification.md`.


## Five additional paintings — 2026-09-25

- Batch 003 adds Liberty Leading the People, Saturn Devouring His Son, The Arnolfini Portrait, The School of Athens and A Bar at the Folies-Bergère. Each has a researched draft and three authentic reproduction choices. All five start pending review.
- The combined editorial review contains 45 active entries across eight media, including 13 paintings. This supersedes earlier queue totals below. Existing feedback, decisions and frozen submissions remain intact; the main app is unchanged.
- Sources: `docs/editorial/batches/batch-003/paintings.json`, `paintings-images.json` and `paintings-research.md`. Combined review: `http://127.0.0.1:4184/REVIEW.html#to-review/painting`. Verification: `docs/editorial/research-2026-09-25/batch-003-paintings/verification.md`.


## Photography review and architecture legibility — 2026-09-25

- Photography is an eighth editorial review medium. Batch 002 now adds 20 drafts: five each in painting, cinema, architecture and photography. The combined review contains 40 active entries. Its saved approval ledger contains 12 submissions; current browser choices can show further approvals. The main app and frozen approved-submissions package remain unchanged.
- Use `docs/editorial/PHOTOGRAPHY_GUIDE.md` alongside `VOICE_GUIDE.md` v0.21. Anchor each story to a specific photograph and verify its caption, circumstances and relevant cultural context. Use community accounts alongside photographer testimony. Distinguish observation, documented facts and interpretation; do not claim original ethnographic fieldwork.
- Julio permits one authentic original photography image; do not manufacture three variants. Preserve the full source composition, color and grain. A neighboring exposure is another photograph. `imageOptionsByMedium.photography` allows one to three genuine reproductions; a single image still requires explicit selection and separate writing approval.
- Architecture must help an unfamiliar reader imagine the whole building. Pantheon A/B are the strongest references. St Peter’s A/B, Villa Rotonda A and Hagia Sophia A/B are also legible references; prefer warm or subtly toned prints over the disliked stark black-and-white Hagia Sophia treatment. Avoid top-down-only plans and isolated close-ups as thumbnail choices. Full-building elevations, exterior engravings and complete cutaways fit the direction. This supersedes earlier permission to use plan-only thumbnails.
- Source-based AI illustration is authorized when suitable authentic architectural views cannot be found. Preserve verified geometry and historical identity. Disclose generation and compare against original references. Do not invent ornament or false archival details.
- Source files: `docs/editorial/batches/batch-002/photography-*.json`; review implementation and per-medium image rules stay in `docs/editorial/batches/batch-001/`. Evidence: `docs/editorial/research-2026-09-25/photography-review/`.

## Process task deletion — 2026-09-25

- Existing Process documentation tasks can be deleted from their editor after a named second-step confirmation. New unsaved tasks have no Delete action.
- `deletedTaskIds` persists removals in the local board. Future reviewed update batches skip those IDs. Keep epic numbering, other cards, sprints, and checked-in seed files intact. Verification: `qa/process-task-delete-2026-09-25/verification.md`.

## Public Process documentation narratives — 2026-09-25

- The Scrum board ships 51 self-contained cards: 42 Done, two In progress, seven To do. A September 25 guarded update rewrites untouched stock copy and adds 12 documented decisions. Preserve personal card edits, order, status, sprint moves, and archived cards during future migrations.
- Descriptions explain the actual option, decision, correction, outcome, and limit so a professor can read them on the future published site. Do not append local QA or Markdown paths to card text. Evidence paths remain internal metadata. A new Vercel origin receives the shipped seed and reviewed updates, not browser-local edits.
- Keep prototype implementation distinct from reader validation, editorial approval, import, authentication, and publication. The 12 approved editorial entries are frozen for later import; Batch 002 adds 15 unapproved drafts. CP193 deadline and submission remain unconfirmed in the board.
- Sources: `app/src/scrum/projectUpdates.ts` and `model.ts`. Handoff: `docs/SCRUM_WORKSPACE.md`. Verification: `qa/process-public-narratives-2026-09-25/verification.md`.

## Second editorial review batch — 2026-09-25

- Batch 002 adds five paintings, five films and five architectural works in `docs/editorial/batches/batch-002/`. All fifteen remain pending editorial review. The shared review now contains 35 active entries: 12 previously approved and 23 to review, including three held theater entries.
- The shared builder in `docs/editorial/batches/batch-001/build_review.py` reads `additionalBatches` from `review-config.json`. Preserve separate batch archives, source-batch labels, existing entry fingerprints, the review storage key, notes and passage comments. The first approved-submissions package remains frozen; no app import or publication occurred.
- Paintings and architecture have three sourced local image options per work. Architectural options use historical 2D drawings and engravings; label proposals and reconstructions accurately. All new choices begin unselected.
- Cinema writing is available, but its 15 film stills await ShotDeck sign-in in Chrome or Julio's agreement to use official film stills. The five IDs in `awaitingImageEntryIds` have explicit pending-image notices and zero image options. Do not use placeholders or treat writing approval alone as complete approval. Replace these pending records with real A/B/C selections when access is available.
- Source evidence and limitations live in the batch's research notes. Verification: `docs/editorial/research-2026-09-25/batch-002-review/verification.md`. The earlier 20 active entries and all 53 frozen submission files were verified unchanged.

## Editorial review status tabs — 2026-09-25

- The review has All, Approved and To review tabs above the art-form filters. Use current browser approval, an eligible image choice, no open comments and no medium hold to define Approved. Other entries, including held theater, appear in To review.
- Retain all image, writing, notes and passage-comment controls in each view. Refresh counts, current status labels and filtering when decisions change. Notes alone do not revoke approval. Return focus to the active status link if an edited entry leaves the view.
- Status tabs open all art forms; medium links then narrow that status. Preserve direct entry links and separate Visual studies. Routes include `#approved`, `#to-review` and `#approved/painting`. Keep the saved submissions folder frozen.
- Verification: `docs/editorial/research-2026-09-25/review-status-tabs/verification.md`.

## First approved editorial submissions — 2026-09-25

- Julio clarified that “ship” means collect approved works in `docs/editorial/approved-submissions/batch-001-2026-09-25/` for later import. Do not change the main prototype or publish content now. These are the app's first approved editorial submissions. A later authorized import will replace the current unreviewed demonstration catalog with approved material.
- This supersedes the earlier whole-batch approval gate. Twelve entries have approved writing and chosen images: David, Stańczyk, The Death of Marat, The Ambassadors, Beethoven's Ninth Symphony, Strange Fruit, Chega de Saudade, Animal Farm, Vidas Secas, Eternal Sunshine of the Spotless Mind, Soul and I'm Still Here. Preserve approved text, image presentation, source metadata and decision evidence in each submission.
- Apollo and Daphne has writing approval after the requested final-sentence deletion, but its images remain unapproved. Gatsby's writing is approved; image C is only a provisional preference while new covers are reviewed. Keep both outside the approved submissions folder until their images are approved.
- Pantheon needs clearer reasons for its construction choices and basic context for its Roman rulers. Borobudur's praised text needs another previous-life story; all its current images were rejected. Tōdai-ji needs a beginner's explanation of Buddha's importance and sculpture images in the selected style. These revisions need review. All three theater entries remain on hold.
- Remove SESC Pompeia from the review queue and retain its source files. The queue contains 20 works; the archive retains 21. Keep earlier candidates and feedback when replacing images. Record entry decisions in `docs/editorial/batches/batch-001/editorial-decisions.json`, bound to the corresponding text and image fingerprints.
- Write for a high school reader with minimal subject knowledge. Explain unfamiliar people, beliefs and practical consequences. Use technical details when their reasons teach something useful. Omit generic caveats that art is interpretive or not literal history. Preserve praised prose when only a sentence deletion or added example was requested. Current guidance: `docs/editorial/VOICE_GUIDE.md`, v0.20.
- Preserve saved notes and the original text of passage comments. Later explicit approval can resolve an older comment with recorded evidence. Writing approval, image approval, readiness for later import and publication remain distinct. Workflow: `docs/editorial/IMAGE_REVIEW_WORKFLOW.md`.

- September 25 image check: Tōdai-ji background-generation attempts changed fine sculpture details. Keep its three proposals as nonselectable studies (`approvalEligible: false`); do not import them. Borobudur, Apollo and Daphne, and Gatsby have three replacement options each for review.

## Menu-only blur and searchable artwork filters — 2026-09-24

- Bottom scroll blur appears only with the floating navigation menu. The shared menu-render condition also gates blur; artwork/collection details, View Profile, creator/account profiles, Home search, Create and its exit transition, keyboard, sheets, and full-screen viewing suppress it. Returning to a menu page restores the existing scroll-dependent blur. Keep the protected runtime unchanged.
- Shared artwork filters use searchable Artist and Country choosers, with options derived from the current catalog. Country replaces the visible Place label; the existing internal `place` field remains unchanged. Discover's country shortcut uses the same wording.
- Artwork date offers decade and century presets above editable From year/To year fields. Selecting a preset fills the range; custom input remains available. Remove the previous explanatory date paragraph. Keep validation, draft-only edits until Done, Reset, focus return, and all four locales.
- Sources: `app/src/Prototype.tsx`, `app/src/ArtworkFilterSheet.tsx`, `app/src/SearchableArtworkFilter.tsx`, and `app/src/artwork-filter-sheet.css`. Verification: `qa/filter-search-and-menu-blur-2026-09-24/verification.md`.

## Shared workspace top bar — 2026-09-24

- Prototype, Design system, and Process documentation share a 44px dark bar with the workspace picker on the left and the viewer's local date and time on the right. Remove the centered **Taste (V1.2) / Project Management** label and the **JC** badge from this bar. Keep versioned project names elsewhere.
- Show weekday, month, ordinal day, and time with lowercase a.m./p.m. on wide screens. Use a compact month/day/time display on narrow screens, while the full date and time remains available to assistive technology and on hover. Refresh at the minute boundary and when the page becomes visible.
- Source: `app/src/design-system/DesignSystem.tsx` and `design-system.css`. Checks: `qa/workspace-topbar-clock-2026-09-24/verification.md`. This supersedes older top-bar descriptions below.

## Selected Library overview and expanded artwork filters — 2026-09-24

- Julio selected **Library overview** as the normal Library: folder covers above all saved artworks. Use the current account’s actual saves/folders. Explicit `library-study=compact|switcher|overview` routes retain disposable comparison data; the comparison now initially shows Overview. This supersedes the unselected/default-unchanged note below.
- Folder detail places Back alone in the top row. The title/count and Filters/grid/list row sits underneath. Back uses a 24px pale square with 4px corners and a 14px chevron, inside a 32px fine /44px coarse target. Keep artwork/detail return, folder rail position, focus and all existing account persistence.
- All artwork Filters/Sort & Filter controls share `ArtworkFilterSheet`: default/title/oldest/newest sorting, Medium, Artist, Place, and an inclusive From year/To year range. Blank bounds are open-ended; equal years select that year; invalid/reversed ranges cannot apply. Draft changes commit with Done; Reset clears the draft. Creator filters retain Saved works.
- Date matching uses numeric catalog bounds separate from localized display dates. Recorded periods match ranges they overlap; c. dates use the displayed year, without inventing a tolerance. Preserve recorded display labels. Filters stay local to their screen and survive artwork detail return.
- Sources: `app/src/LibraryStudyScreen.tsx`, `library-study.css`, `GalleryControls.tsx`, `ArtworkFilterSheet.tsx`, `artwork-filter-sheet.css`, `artwork-filters.ts`, and `Prototype.tsx`. Verification: `qa/library-overview-filters-2026-09-24/verification.md`.


## Switch Accounts preview — 2026-09-24

- Settings opens an interactive two-page account chooser. Switch between Julio and the fictional Leila preview, or add a local preview account by email, Apple, Google, or Facebook. These controls create only local identities; they do not authenticate, send email, or sync across devices. Never store the entered email.
- Each account has its own Library saves, folders, notes, preferences, follows, collections, and Create draft. Julio keeps his original storage keys and data. Leila begins with two saved artworks; new accounts begin empty. Switching updates Settings, Profile, saved controls, and Library together, then lands on Settings.
- Preserve chooser Back, X, Escape, focus, four locales, Dark mode, reduced motion, and phone safe areas. Explicit study routes keep account changes temporary. The Language sheet is titled **Switch language** without a description. The Notifications sheet omits its top description and prototype footer.
- The account chooser shows **Accounts on this device** as its only visible heading. Keep the X at the top right. Omit the repeated **Switch accounts** top title and the local/sync footnote. Retain an accessible dialog name.
- The Add account page omits the visible **Add account** and **Use another account** headings. Start with the labeled email field and action, then **Or continue with** and centered Apple, Google, and Facebook button contents. Keep Back, X, an accessible dialog name, and the note explaining the local preview's sign-in limits.
- Sources: `app/src/SwitchAccountsFlow.tsx`, `app/src/switch-accounts.css`, `app/src/account-preview.ts`, `app/src/Prototype.tsx`, `app/src/today-savers.ts`. Checks and captures: `qa/switch-accounts-2026-09-24/verification.md`. This supersedes the informational-only Switch Accounts guidance below.

## Library navigation comparison — 2026-09-24

- Compare three unselected layouts at `http://127.0.0.1:4173/library-study.html`: **Compact tabs** (`compact`) combines Artworks/Folders counts and gallery actions in one header; **Single switcher** (`switcher`) uses one section dropdown; **Library overview** (`overview`) places a folder rail above saved artworks. Explicit `?library-study=` routes enter Library directly. The normal Library stays unchanged until Julio chooses.
- All variants use the same disposable sample of five existing artworks and three folders, including an empty folder and an artwork outside folders. Folder creation, notes, saves, follows, preferences, collections and Create drafts remain temporary. Reset reloads the sample; never write it to the user's saved Library.
- Reuse shared artwork lists, gallery controls, folder creation and artwork detail/return behavior. Keep two-column natural-ratio artwork grids, 12/16px captions, muted creator text, 16px row gaps and 4px column gaps. Folder covers and Back controls use 4px corners. Keep keyboard navigation, focus/scroll restoration, theme tokens, four locales and reduced motion.
- Sources: `app/src/LibraryStudyScreen.tsx`, `library-study.css`, `library-study-data.ts`, root `Prototype.tsx` study guards and `today-savers.ts`. Comparison: `app/public/library-study.html`. Verification: `qa/library-navigation-2026-09-24/verification.md`. These are interactive options for review, not a selected design.


## Text-only Taste wordmark — 2026-09-23

- Use **Taste** as the visible wordmark. Remove the supplied silhouette and its reserved slot from the shared Process documentation sidebar on every view. The icon-comparison page and Prototype masthead also use the text-only wordmark.
- Keep functional workspace-picker, navigation, and action icons. **Taste (V1.2)** remains the versioned project label where shown outside the wordmark.
- Sources: `app/src/scrum/ScrumWorkspace.tsx`, `app/src/scrum/scrum.css`, `app/src/Prototype.tsx`, and `app/public/process-icons.html`. Handoff and checks: `docs/SCRUM_WORKSPACE.md` and `qa/text-wordmark-2026-09-23/verification.md`.

## Search controls and shared artwork lists — 2026-09-23

- Expanded Home search has the normal Search glyph on the left and an **X on the right to close**. A localized **Clear** text action appears only with a query, preserving distinct clearing and dismissal. Coarse-pointer targets remain44px high and at least44px wide.
- Gallery, Artists and Accounts reserve the same heading-row height: **32px fine /44px coarse**. Keep centered title alignment; conditional Filters/view controls must not shift titles or result counts between scopes.
- Search/Home List, Library Artworks List and collection contents use **ArtworkListRow**. Shared geometry: **64px 3:2 image**,2px image corners,16px column gap,8px vertical/4px horizontal padding,60px minimum row height and thin dividers. Title uses13/16px at500; author and artwork date share the second line in `--app-muted`. Large text uses14/18px consistently.
- Keep grids, artwork rails, people lists and historical comparison-study layouts distinct. Shared list navigation preserves existing artwork detail/return behavior. Do not duplicate row CSS in individual screens.
- Sources: `app/src/ArtworkListRow.tsx`, `app/src/artwork-list-row.css`, `app/src/Prototype.tsx`, `app/src/discover.css`, `app/src/home-search-surface.css`. Evidence: `qa/search-list-consistency-2026-09-23/verification.md`.


## Semester sprint outline and backlog assignment — 2026-09-23

- Product backlog table rows now have a Sprint dropdown beside Status. Offer only planned sprints that have not ended, including an unstarted current sprint. Choosing one moves the task to that sprint without changing its other fields. Restore an archived task to active work; keep focus on the next backlog selector or navigation after its row leaves.
- Blank planned Sprints 3–9 continue the 14-day schedule from 28 September through 3 January. Sprint 9 begins 21 December and covers late December. Leave distant sprint goals and tasks empty until Julio plans them.
- Add the outline to existing saved boards once, preserving personal edits and custom dates. Skip slots that overlap custom sprints. Do not recreate a placeholder removed after migration. Keep the sidebar chronological and show both years when a sprint crosses January.
- Sources: `app/src/scrum/seed.ts`, `model.ts`, `ScrumWorkspace.tsx`, and `scrum.css`. Handoff and checks: `docs/SCRUM_WORKSPACE.md` and `qa/sprint-assignment-2026-09-23/verification.md`. Local behavior passed build, model tests, desktop and narrow-browser checks; Julio's visual review remains open.

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
- Great Wave measures about **266px** high at the iPhone's 377px image width and **290px** at Pixel's 411px width. Build, image metadata, visual previews and viewer return verified. This is a local trial awaiting Julio's visual review. Handoff: `qa/variable-daily-images-2026-09-23/verification.md`.

## Single saved-by avatar — 2026-09-23

- Daily's saved-by control shows **one profile avatar** beside the count, replacing the two-avatar preview. Apply through shared `TodaySaveActions` across all Daily editions and artwork details. Keep the first saver, including the current reader after saving, the 22px avatar, opaque count pill, rolling count, and complete people sheet unchanged.

## Back controls and Explore list dates — 2026-09-23

- App-owned Back arrow surfaces use **4px corners**, superseding the circular Back guidance below. Preserve each control's icon, dimensions, hit area, focus, themes, and navigation. Apply to Explore, artwork details, collections, creator profiles, user profiles, and onboarding; Create already uses 4px corners.
- Explore Gallery **List** captions show **creator, artwork production year**, using the same localized `piece.year` value as Home. Preserve approximate dates, periods, and recorded spans. Grid captions and row geometry stay unchanged.

## Approximate artwork dates — 2026-09-23

- Show approximate artwork production dates as **c. + one year**, without a date range. Chart of Hell displays **c. 1480** by Julio's choice. Use **c.** for approximate artist birth years too. Keep documented spans without an approximation marker, such as The Kiss's 1907–1908, and keep artist birth/death ranges distinct. Use shared records so Today, details, cards, search, creator profiles, and the viewer agree. This supersedes the older instruction to spell out “circa.” Verification: `qa/date-abbreviation-2026-09-23/verification.md`.

## Explore List reference — 2026-09-23

- Julio supplied a directory-style reference. Explore Gallery List now uses a fixed 64px image column, 3:2 cover thumbnails, a 16px column gap, and top-aligned title/creator. Julio rejected the earlier 22%-wide 2:1 thumbnails and excess whitespace. Preserve existing focal positions and localized text.
- Use 8px vertical/4px horizontal row padding, 60px minimum height, no gaps between rows, and 0.5px dividers using muted text at 22% opacity. Use 13/16px primary text, medium-weight titles, and allow long text to increase row height. This supersedes the earlier 64px square, vertically centered list thumbnails.
- Keep each row as the existing artwork-opening button. Preserve focus/scroll return, sorting, filters, and the nine-work preview. The three-column Grid view stays unchanged. No extra plus/save action is added from the reference.
- Handoff and checks: `qa/gallery-list-reference-2026-09-23/verification.md` (relative to the project root). Visual approval remains Julio's decision.

## Gallery sizing and Back control — 2026-09-23

- Gallery previews nine artworks in a three-column, three-row grid. Keep Show all for the complete set and preserve the existing image crops.
- Filters uses smaller 12/16px text. Preserve its spacing, caret, order before Grid/List, and hit area.
- Discover something new cards have a 72px minimum height, with top-left text alignment and 12px padding. Preserve the two-column layout and typography.
- When Gallery follows Discover something new, reduce the combined section spacing from 52px to 24px, preserving the thin divider and other section gaps.
- Expanded and filtered Gallery Back uses the artwork-detail style: an icon-only 32px circle, 14px CaretLeft, surface fill, and muted glyph. Keep the localized accessible label, return behavior, focus outline, and 44px coarse-pointer size.

## Gallery Filters control — 2026-09-23

- Julio rejected the filled Sort & Filter button and requested it before the grid/list controls. Gallery now uses **Filters + chevron**, followed by Grid and List in both visual and keyboard order. Use a transparent resting surface, muted 12/16px text, 4px corners, subtle hover/open fill, and a 4px dot for applied sorting/filtering.
- Keep the label in expanded Gallery too. Preserve the existing Sort & Filter sheet, all four locales, reset/sort/medium behavior, focus restoration, and 44px coarse-pointer targets. New transitions last 120–160ms and stop under reduced motion. The creator-profile control remains unchanged. Verification: `qa/gallery-filter-control-2026-09-23/verification.md`; visual acceptance is pending.

## Explore Gallery refinement — 2026-09-23

- Normal Explore now omits Collections. Search, Discover something new, Gallery, then Explore by category remain in that order. Saved study routes retain their original layouts.
- Gallery previews nine artworks in three rows and three columns. A centered **Show all** pill below the preview opens the complete Gallery with Back, grid/list controls, and Sort & Filter. Back restores the preview scroll/focus; artwork detail retains the expanded view and filters.
- Sort & Filter uses the shared sheet: Featured, Title A–Z, Title Z–A, and Medium, with Reset filters and Done. New category or primary search-scope selection clears the extra Gallery medium constraint. No Show all action appears for zero results or when the preview already contains every result.
- List images use equal **64 × 64px cover crops**, preserving recorded focal positions. Grid retains three columns and the existing portrait cap. Typography, category cards, themes and protected phone runtime stay shared.
- Source: `app/src/Prototype.tsx` and `app/src/discover.css`. Verification: `qa/gallery-expansion-2026-09-23/verification.md`.


## Home control readability — 2026-09-23

- Julio requested another 2px increase for the remaining Home controls and metadata. Date, Search, Shuffle, Save, saved-by count/avatars, and Expand now use 22px visible surfaces. Save/count labels use 10/12px, date 12/14px, and Last edited 12/12px. Search/Shuffle glyphs use 14px. Preserve the original Search and Expand shapes; this latest size request supersedes their former 20px sizing lock.
- The Daily top row has a **10px** gap above the artwork, up from 8px. The title-to-creator gap stays 1px; the 22px actions use -2px block margins to avoid increasing the title row's height. Keep previously enlarged title, creator, category, and description sizes.
- On Daily and opened artwork details, keep the title 8px before the fixed Save controls. With a one-line title, keep creator/date in that left column. When the title wraps, let creator/date use the full width below the controls. Keep a short date together when it fits. Verification: `qa/conditional-metadata-wrap-2026-09-23/verification.md`.
- Technical information and creator-card headings use 16/20px; their default details/body use 14/18px. Preserve Large/System overrides. Count digit travel matches its new 12px line box. Coarse-pointer Shuffle keeps a 44px target and 22px visible circle.
- Noh Mask now displays **Theater**, with **Teatro** in Portuguese, Italian, and Spanish. Keep the internal Performance ID for existing search/category compatibility. Verification: `qa/home-control-scale-2026-09-23/verification.md`. Visual acceptance is pending.

## Selected Explore layout — Compact browse, 2026-09-23

- Julio rejected the six later experiments and selected the earlier **Compact browse**. It is now the normal Explore layout: Search → Discover something new → Gallery → compact collection cover shelf → Explore by category.
- Reuse the preserved Compact browse component, exact card sizing, typography, spacing, and shared Search/category behavior. Keep the three-column Gallery and portrait cap.
- `DiscoverScreen` defaults its local visual variant to `compact-browse`. The root study flag remains null on the normal route, so ordinary preferences and saves retain their normal persistence. Explicit study queries remain temporary; the saved first-round comparison remains `/explore-saved.html`.
- This selection supersedes the second- and third-round experiment directions below. Verification: `qa/compact-browse-selected-2026-09-23/verification.md`.

## Reading typography trial — 2026-09-23

- Julio requested a 2px increase to the highlighted artwork title, creator line, category pills, and description. Shared Home/artwork detail defaults now use title and creator **16/18px**, description **14/16px**, and category labels **10/12px**. Pill padding remains 2px 6px, so their height increases from 14px to 16px.
- The single-line title-to-creator gap is now **1px**, reduced from 2px. Account for the existing 20px adjacent action row with a -1px creator top margin. Preserve action sizes, image geometry, paragraph spacing, and Large/System reading overrides. This trial supersedes the earlier 14px title/creator, 12px body, and 8px category values. Verification: `qa/reading-type-2026-09-23/verification.md`; visual acceptance is pending.

## Compact Explore concepts, third round — 2026-09-23

- Julio rejected the second-round magazine, room, and index options. Both their typography and layouts felt outside Taste's design system. Do not treat them as the active direction. Compact browse remains the preferred saved baseline, not the default.
- `http://127.0.0.1:4173/explore-study.html` now compares **Gallery & collections** (`switchboard`), **Collection filters** (`lenses`), and **Connected gallery** (`stream`). The first switches between Gallery and Collections with shared underlined tabs; the second filters Gallery in place using compact collection covers; the third places compact collection links between groups of artworks.
- Use established 16/20 regular section labels, 12/16 controls and collection titles, compact metadata, shared semantic colors, three-column Gallery crops and spacing. No editorial mastheads, exhibition-wall compositions, large concept headlines, or enlarged promotional cards in these options.
- Keep Search, Categories at the end, normal app behavior, and the saved Compact browse design. New concepts retain their local choice during category/search filtering and artwork/collection overlays. The first-round comparison remains `/explore-saved.html`; all previous direct study routes remain available.
- New sources: `ExploreSwitchboard.tsx`, `ExploreLenses.tsx`, `ExploreStream.tsx` and their scoped styles. Handoff: `qa/explore-compact-concepts-2026-09-23/verification.md`. These are new experiments for review, not selected defaults.

## Create artwork flow — 2026-09-23

- The Create tab now opens a four-step local artwork flow: artwork, optional images, details, and review. The reference screenshot supplies the sequence, not Artsy copy, commerce, or a publication policy.
- Artist search suggests existing Taste artists and a small sourced reference directory. It opens on field focus and supports aliases, distinct identities, and identifying dates. Caravaggio and the two Pieter Bruegels are reference examples. Free text and an **I don't know the artist** choice remain available.
- **Title** has an **I don't know the title** choice. Its example placeholder is not a saved value. Artist or the unknown choice, title or the unknown choice, one of the seven editorial art forms, and short context are required. Year, material/format, and sources are optional. Create does not collect physical dimensions.
- Images use up to three JPG, PNG, or WebP files of 10 MB each, with rights confirmation when images are present. The top-right **Save & exit** action is removed. Closing the flow retains its local draft and restores the step. Explicit study query routes use temporary Create state and leave the main draft untouched.
- Keep the four-part progress indicator and its accessible step count. Images shows **Add images**, file guidance, and the upload control. Details shows its fields directly. Review shows **Review your artwork**, cards, and Edit actions. Omit the repeated step-count line and intro on these three steps, the duplicate image label, the Details dimensions section, and the Review disclosure. Keep the local-only explanation on completion.
- The Images heading-to-guidance gap is 12px. Give the Details **Optional** hints a clear space after their labels. Keep Review card content close to the top border and retain 44px Edit targets. A single uploaded image uses a full-width 3:2 preview without cropping; two images use two columns and three use three. Latest spacing handoff: `qa/create-spacing-refinement-2026-09-23/verification.md`.
- The Create design-system pass uses 44px fields and Art form targets with 14px text, a 48px/14px footer button, and plain unknown-choice rows. The latest Art form variation opens below its trigger within Details. The trigger reads **Art form**, shows the selected value and a chevron; the list uses 44px rows. The selected choice has a white surface in Light, a raised charcoal surface in Dark, and a checkmark. Arrow keys, Escape, and outside press work without leaving Details; reduced motion removes the chevron movement. Latest verification and captures: `qa/create-art-form-variation-2026-09-23/verification.md`. The earlier choice-sheet pass is recorded in `qa/create-design-system-2026-09-23/verification.md`.
- September 24 refinement: Art form list corners are 8px; its selected indicator and options are 4px. The first three Create footer actions all read **Continue**. The Review step ends with **Finish preview** because the flow does not publish artwork. Preserve localized labels and the existing validation and navigation.
- Create step content now moves 8px out over 90ms and 14px in over 180ms, reversing direction for Back and Review Edit. Entering or closing Create shifts its page 16–18px with a 220ms fade. Use the shared ease-out curve; do not add scale, blur, or spring motion. Keep the header/footer fixed, the previous tab mounted and inert beneath Create, and restore its navigation focus only after Create exits. Reduced motion changes pages immediately. Verification: `qa/create-flow-motion-2026-09-23/verification.md`.
- Finishing shows a clear local-preview confirmation. It sends no data, publishes no work, and does not add a record to Library or the held editorial batch. Keep the existing Daily **Suggest a story** sheet separate.
- Preserve 20px gutters, semantic Light/Dark tokens, PP Neue Montreal, four locales, both phone previews, safe areas, keyboard behavior, focus, and reduced motion. Source: app/src/Prototype.tsx, app/src/prototype.css, app/src/create-artist-directory.ts, and app/src/create-artwork-storage.ts. Handoff: qa/create-artwork-flow-2026-09-23/verification.md. Julio's visual approval is pending.

## Home icon and Daily shuffle — 2026-09-23

- Julio requested a simpler Home glyph and replaced the proposed top-left profile avatar with **Shuffle artwork**. This supersedes the earlier no-shuffle decision. Keep the existing portrait in profile and account surfaces.
- Shuffle opens a different existing featured Daily edition, excludes the current edition and contribution invitation, and retains its actual edition date. Preserve chronological swipe and keyboard navigation. Use a 180ms opacity fade, immediate reduced-motion updates, and focus on the destination's shuffle control.
- The shared Home glyph has a lower roof, continuous walls, and a clear doorway. Keep all five bottom-menu icons at 20px, existing 44px targets, and selection behavior. Home Search and Expand remain protected and unchanged.
- Shuffle uses a 12px shared glyph inside a 20px visible circle; coarse pointers get a 44px target and top row. Source: `app/src/Prototype.tsx`, `prototype.css`, and `design-system/PrototypeIcons.tsx`. Verification: `qa/home-shuffle-2026-09-23/verification.md`. Visual acceptance remains Julio's decision.

## Onboarding preview — 2026-09-23

- **Prototype / Onboarding** is the fourth workspace choice at `http://127.0.0.1:4173/?view=onboarding`. Keep normal Prototype as the default so routine review does not replay onboarding.
- The welcome screen uses full-screen painting imagery behind the status area, with a slow crossfade through Girl with a Pearl Earring, The Kiss, and a portrait of Dante. Rotation pauses during email entry and policy sheets; reduced motion keeps the first image still. The maker credit is removed, and the story subtitle is larger.
- Sign-up/log-in presents email, Apple, Google, and Facebook choices. These advance the local flow without creating an account. No Taste Terms and Conditions or Privacy Policy exists yet, so the footer identifies them as in progress and opens informational preview sheets. Do not present an agreement to nonexistent policies.
- Reminder choices match Settings: 08:00, 09:00, 18:00, or Not now. Finishing updates the existing notification preference; chosen categories save locally under `taste.onboarding.interests.v1`. Interests do not yet personalize the editorial Daily artwork. Authentication and notification delivery are not connected to this web preview.
- Provider buttons use recognizable black Apple, Google, and Facebook marks on white pills in both themes. The Terms and Privacy links and email arrow use muted gray. The email field uses a soft inset focus cue. Seven interest cards use Explore's square top-left background labels; the explanatory note beneath them is removed.
- The Apple mark stays 22px; Google is scaled to 88% and Facebook to 98%. Reminder copy uses **Save your notification preferences**, daily-practice and schedule lines, and **The Death of Socrates (1787)** in the preview; the redundant note is removed. Interests uses **Favorite art forms** without a subtitle. Its seven cards fit without scroll on the iPhone and Pixel 10 previews. Back uses a 32px visible circle and a 44px target.
- Source: `app/src/OnboardingFlow.tsx`, `app/src/onboarding.css`, `app/src/Prototype.tsx`, and `app/src/design-system/DesignSystem.tsx`. Handoff: `qa/onboarding-2026-09-23/verification.md`. Julio's visual approval remains pending.

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
- This update supersedes earlier profile black-bar, gear, circular profile-folder, menu-avatar, and single-action account-card guidance. The Library's own circular folder rail remains. Handoff: `qa/account-folders-refinement-2026-09-23/verification.md`; visual approval remains Julio's decision.

## Profile and Settings — 2026-09-23

- Settings now starts with a **Your account** header and a pale card using Julio's supplied portrait, name, live saved-artwork and folder counts, and **View profile**. A single visible **Settings** heading introduces the existing account and preference controls. The earlier artwork-image cultural-library card is superseded.
- At the end of Settings, show **About Taste** with **Version 1.2**, then **Rate App** without a leading icon, then **Legal** last. Preserve existing sheet actions, preference persistence, four locales, and the 20px page inset. The About sheet uses Version 1.2 too.
- View profile opens an app-owned screen with the current reader portrait/name and four live sections: **Artworks**, **Folders**, **Following**, and **Followers**. Artworks uses global saves and opens the shared artwork detail with Edit; Folders uses personal folders and their members; Following uses persisted followed sample people, labeled as such. The local preview has no incoming follower data, so Followers shows **0** and an empty state. The component accepts a follower list so a future account source can update the count and rows.
- Profile Back and its top-right gear return to Settings. The profile stays mounted and inert under an opened artwork, preserving section, folder, scroll, and focus. The bottom menu hides on profile and detail. Keep PP Neue Montreal, light/dark tokens, protected phone chrome, and no invented location, auction data, or self-follow action. Source: `app/src/ProfileScreen.tsx`, `app/src/profile-screen.css`, `app/src/Prototype.tsx`, `app/src/prototype.css`, and the original `Gear` in `app/src/design-system/PrototypeIcons.tsx`. Handoff: `qa/profile-settings-2026-09-23/verification.md`. Julio's visual review is pending.

## Saved-reference Library — 2026-09-23

- Julio selected **Artworks / Folders** as the Library's only top tabs. This supersedes older Favourites tabs for Pieces, Creators, or Places. The bottom-menu destination and Settings card read Library in all four locales. Artworks shows every globally saved work, including works in no folder. Folders shows personal folders as circular covers and the selected folder's saved works in a two-column grid.
- The visible Folder wording reuses the existing board model and storage. A work may belong to several folders; removing a folder membership does not unsave it. The default folder is localized as **My folder**. New folders can be created in the Library. Keep IDs, migration, saved works, and custom names intact.
- Opening a Library work reuses Home's reading detail with Back on the left and **Edit** on the right. Edit changes its personal folder memberships and a private note. Original artwork and editorial fields stay intact. Notes use `daily-culture.library-notes.v1` locally. Back restores the Library tab, selected folder, scroll, and source focus.
- Use the attached reference's two-tab hierarchy, circular folder rail, and image-led two-column cards. The current implementation uses consistent card crops, 20px Library gutters, PP Neue Montreal, shared theme tokens, protected phone chrome, and the existing full-screen viewer. Source: `app/src/Prototype.tsx`, `app/src/prototype.css`, `app/src/library-notes.ts`. Handoff and checks: `qa/library-redesign-2026-09-23/verification.md`. Julio's visual review is pending.

## Search scopes and compact refinements — 2026-09-23

- Search section headings, including **Collections**, **Discover something new**, and **Gallery**, use **16px / 20px**, weight **400**, and zero tracking. Match Home's **Check out more** heading. Gallery uses **three equal responsive columns** with 4px gaps; images keep their natural aspect ratio up to a responsive 4:5 portrait cap, cropping taller images with their recorded focal position. Preserve list view's 64 × 64px thumbnails. Source: `app/src/discover.css`. Verification: `qa/gallery-three-columns-2026-09-23/verification.md`.
- **Explore by category** uses the seven arts from the content plan: Architecture, Sculpture, Painting, Music, Literature, Theater, and Cinema. Keep this navigation separate from the eight existing Medium filters. Use two responsive columns, 6:7 portrait images, 8px gaps, 4px corners, and a top-left label at 16/20 with semantic foreground/background. Existing artwork covers retain recorded focal positions; independent category covers have provenance in `app/public/assets/categories/README.md`. Categories without live works show a localized empty state with Back/Escape; do not import the held editorial batch. Handoff: `qa/gallery-three-columns-2026-09-23/verification.md`.
- Merged Search always shows **Artworks / Artists / Accounts / Medium**, including before typing. This supersedes the query-only All / Places / Art forms / Creators selector. Artists opens existing artist profiles and uses shared **Save / Saved** state. Accounts searches the existing 65 fictional sample profiles by name or handle, displays **Sample profiles**, and keeps social **Follow / Following** separate from artist saves.
- Only active **Medium** reveals a second selector: All plus the available media, including Photography. Combine the selected medium with the query and retain that choice while editing or clearing the query. Switching the primary scope clears hidden medium and shortcut filters. **Show all** is absent when the current result count is zero. Preserve compact fields, shared gutters, return navigation, and Home's separate search.
- Search content starts at **64px** top padding, 8px lower than before. Julio reverted the extra 2px below the search field: the primary-selector gap is **8px** again. The secondary Medium gap remains 8px.
- Display unknown makers as localized **Unknown** through `localizePiece`; use the same English label in library patterns. Keep canonical creator IDs and source records intact. Save destinations use localized **Choose folder / New folder / My folder** wording. Preserve custom folder names, memberships, and existing storage keys.
- The bottom-menu profile avatar is now **20 × 20px**, without an outline, border, or shadow ring in either theme. Preserve its **44 × 44px** target and selection circle, the supplied portrait, initials fallback, and all other avatar sizes.
- Source: `app/src/Prototype.tsx`, `app/src/SearchEntities.tsx`, `app/src/search-entities.css`, `app/src/discover.css`, `app/src/today-savers.css`, `app/src/today-boards.ts`, and `app/src/design-system/patterns.tsx`. Handoff: `qa/search-entities-refinement-2026-09-23/verification.md`; consult it for completed checks. Visual acceptance remains Julio's decision.

## Save artists — 2026-09-23

- Artist actions use **Save / Saved**, with localized accessible names and removal actions in English, Portuguese, Italian, and Spanish. Apply the same semantics to artist biography cards, artist profiles, and the design-system showcase. This supersedes earlier artist Follow / Following wording.
- Preserve the existing creator state, storage key, and interactions for compatibility. Social people in the saved-by sheet still use **Follow / Following** and their separate persistence.

## Search return navigation — 2026-09-23

- Filtered shortcut/category galleries, including Our picks → Most loved, show a localized Back arrow and their current section title. Back or Escape restores the browsing position and opening control. Plain text queries retain Clear and Show all.
- Keep Discover and collection pages mounted while an artwork covers them, with `inert`, `aria-hidden`, and hidden visibility. Artwork Back/Escape returns to its collection when applicable; collection Back/Escape returns to Search. Restore source focus after the parent becomes interactive.
- Preserve the selected field filter, query, gallery layout, scroll position, and Home’s existing return behavior. No new page transition is added.
- Source: `app/src/Prototype.tsx` and `app/src/discover.css`. Verification: `qa/dark-system-2026-09-23/verification.md`.


## Charcoal dark theme — 2026-09-23

- Julio requested a darker theme from his charcoal reminder screenshot, using at most five neutral tones. Dark mode now uses `#171717` canvas, `#262626` surfaces, `#333333` raised surfaces/dividers, `#a3a3a3` muted text, and `#f2f2f2` primary text. Selected capsules use the dark canvas on the surface tone. This supersedes the earlier three-gray dark-mode mapping; Light and compact geometry stay unchanged.
- Julio liked the dark direction and requested more transparent menu glass, with Savee as an additional reference. The dark menu now uses the surface tone at 72% opacity, superseding 82%. Keep 16px blur, an 8% soft-white border, and a 4% inset highlight. Inactive icons use soft white at 70% opacity for readability through the glass; the selected circle uses the dark canvas with a full-opacity soft-white icon. Use shared semantic aliases; opacity effects are not extra solid palette swatches.
- In both themes, the selected compact menu keeps its 248 × 52px capsule and five fixed 44 × 44px targets. Use equal 4px visible insets around the selected circle at the capsule ends: 3px padding plus the 1px border. Distribute the remaining horizontal space between targets. Preserve the existing selection animation and the solid/outline study layouts.
- Keep the full-screen artwork viewer's existing image-specific black/white glass and protected device chrome. Source: `app/src/design-system/tokens.ts`, generated token exports, and `app/src/prototype.css`; the design-system library shows the same dark values. Initial theme checks: `qa/dark-system-2026-09-23/verification.md`. Latest refinement handoff: `qa/menu-glass-refinement-2026-09-23/verification.md`. The latest refinement awaits Julio's visual review.

## Shared Home and Search gutters — 2026-09-23

- Home and Search use `--app-page-gutter: 8px` on each side. Search previously had 4px; this adds 4px per side to its cards, grids, field, and section headings. Existing 4px inner text/control insets make those sections start 12px from the screen edge.
- Artwork details reuse Home’s gutter. Library, Settings, Create, collections, and creator reading already have roomier 20px content insets; creator artwork remains intentionally full width.
- Source: `app/src/prototype.css` and `app/src/discover.css`. Evidence: `qa/page-gutters-2026-09-23/verification.md`.


## Bottom-menu Search refinement — 2026-09-23

- Remove the small upper art-form chip rail from the merged Search/Discover page. Keep the larger All / Places / Art forms / Creators selector, shown only while a query is present. Category tiles, browse shortcuts, and Show all remain available.
- The search field is 32px high with fine pointers, using 14/20 input text, 16px search/clear icons, and a 24px clear target. Coarse pointers use a 44px field and clear target. Typing must not resize the field.
- Typing resets the browse-only art-form and shortcut selection to All; Clear resets the query and all filters. This prevents invisible browse filters from narrowing search results. Scope this change to bottom-menu Search/Discover; preserve Today's expandable search and its Home icon.
- Source: `app/src/Prototype.tsx` and `app/src/discover.css`. Handoff: `qa/discover-search-2026-09-23/verification.md`. Build and focused interaction checks passed. Visual approval remains Julio’s decision; consult the handoff for evidence.

## Artwork details aligned with Home — 2026-09-23

- Julio requested opened artworks use Home's reading design. `PieceDetail` now reuses `TodayArticle`: the 420px hero, PP Neue Montreal, title/actions, creator/date, categories, story, Last edited, Technical information, and creator panel. Keep the shared 56px section gap. Details omit the brand masthead, tagline, and current Daily date.
- Detail navigation uses a 32px pale Back circle on the left, expanding to 44px on coarse pointers, with a 14px `CaretLeft`. The right-side 20px pale label shows the artwork's actual art form. Scope detail styles with `.today-article[data-reading-view="detail"]` and `.artwork-detail-scroll`.
- Reuse functional `TodaySaveActions` with root save/board state, the saved-by sheet, and the existing image viewer. Back returns to the underlying view; retain Daily's reading position and search query. Details keep their existing absence of a related rail; Home retains the selected Gallery rail.
- Source: `app/src/Prototype.tsx` and `app/src/prototype.css`. Handoff: `qa/artwork-detail-home-2026-09-23/verification.md`. Implementation awaits Julio's visual review; consult the handoff for completed checks.

## Prototype icon refinement — 2026-09-23

- Julio requested subtle Cursor-inspired refinements across the main prototype after selecting Process documentation icons. Use the shared original glyphs in `app/src/design-system/PrototypeIcons.tsx` for app-owned navigation and actions, with consistent geometric forms, restrained corners, and clear selected states. This supersedes the earlier museum-style icon shapes; preserve the existing menu geometry and 160ms opacity-only activation.
- Do not change the homepage Search glyph (`Prototype.tsx`, `.today-search`, original Phosphor MagnifyingGlass at 12px) or the homepage Expand glyph (`TodaySaveActions.tsx`, `.today-save-fullscreen`, exact Paper SVG). Their 20px controls, path data, size, and styling are explicitly protected by Julio's latest screenshot.
- Keep profile photos/initials as avatars, preserve existing hit areas, labels, theme colors, like/follow motion, and protected phone chrome. The Process documentation mixed selection remains independent. Handoff and verification: `qa/prototype-icons-2026-09-23/verification.md`.

## Selected Gallery rail and section spacing — 2026-09-23

- Julio requested the creator-card → Check out more gap match Last edited → Technical information. Both now use `--today-section-gap: 56px` on Today. Live measurements found the former was 40px and the latter 56px. Keep the reference gap unchanged; this supersedes the earlier 40px related-section margin.
- Julio selected **Gallery rail** (`gallery`) as the default Check out more layout. Use unboxed 208 × 156px images, compact captions, and a 12px rail gap. This supersedes the earlier filled cards. **Paired grid** (`grid`) and **Compact list** (`list`) remain available with Gallery rail at `http://127.0.0.1:4173/related-study.html`.
- Use explicit `related-study` query parameters for the comparison. Preserve existing related-work selection, localized titles/creator/date, image focal positions, theme tokens, PP Neue Montreal, and protected Carousel/MobileScroll behavior. Opening a work retains Today and its reading position for return.
- Comparison previews start near the related section, with same-origin View section/Reset controls. Study saves, preferences, collections, and follows remain temporary. Do not treat a study or test as visual approval.
- Source: `app/src/RelatedWorks.tsx`, `app/src/related-works.css`, `app/src/Prototype.tsx`, and `app/src/prototype.css`. Handoff: `qa/related-works-2026-09-23/verification.md`.

## Selected Process documentation icons — 2026-09-23

- Julio selected individual glyphs across the comparison families: **Board: Tiles; List: Tiles; Sprint plan: Minimal; Product backlog: Tiles; About: Minimal**. Apply this mixed selection by default, consistently in the sidebar and view tabs. Do not apply one family to all icons.
- `app/src/scrum/ProcessIcons.tsx` owns the mapping. Explicit `process-icons=panels`, `tiles`, or `minimal` URLs remain comparison previews only. The later text-only Taste wordmark replaces the supplied silhouette; preserve navigation icon sizes, labels, spacing, and interactions.

## Today search variations and profile avatars — 2026-09-23

- Profile avatars use an uploaded photo when available, otherwise two initials. Never substitute a person-outline icon. `SaverAvatar` supports `avatarUrl`, with initials on missing or failed images. The current reader uses Julio’s supplied portrait, compressed to a 256 × 256 WebP at `public/assets/profile/julio-avatar.webp` in the app. JC is the image-failure fallback; its people-sheet row still localizes You. The Settings menu avatar uses the same component. Preserve its 24px size and the original source photo. Julio requested a wider crop: use the original’s full-width upper square, keeping the head, shoulders, and hand visible. Keep the saved-by count pill above overlapping avatars with an opaque fill in both themes. This supersedes the earlier silhouette placeholder.
- Today's top Search now opens search within Home. It has independent query state from the bottom Search/Discover destination. Keep DailyPager mounted under search and result details, with its edition and reading scroll intact; closing an artwork returns to the same query and results. Dismiss search to return focus to the original icon.
- Compare three unselected explorations at `http://127.0.0.1:4173/search-study.html`: **Expand in place** (`inline`) grows the 20px icon into a 32px field with compact results over the artwork; **Focus view** (`focus`) adds a full search surface and two-column artwork results; **Search sheet** (`sheet`) uses the protected rounded BottomSheet with search near the keyboard. Explicit `today-search-study` query parameters select variants. Inline is the working default pending Julio's choice, not a recorded selection.
- Use a 320ms width expansion with restrained 180–200ms fades; reduced motion removes movement. Keep PP Neue Montreal, monochrome tokens, soft search-field focus, and keyboard focus cues. Search/Discover's earlier black focus stroke is replaced with a 16%-opacity medium-gray inset stroke.
- Use KeyboardInput. Keep overlays and results above the visible keyboard and outside protected status/navigation regions. Defer sheet keyboard dismissal until result/close clicks run, so the sheet cannot move away from the pressed target. Preserve Escape, clear, empty results, text entry, and all four locales.
- Search covers the existing localized artwork titles, creators, places, forms, context, and stories. No remote search service is added. Search-study preferences, saves, boards, collections, creator follows, and people follows remain temporary; comparison controls use same-origin parent messages only.
- Source: `app/src/TodaySearch.tsx`, `today-search.css`, `Prototype.tsx`, `TodaySaversSheet.tsx`, and `app/public/search-study.html`. Handoff: `qa/today-search-2026-09-23/verification.md`.

## Seven-medium content batches and image choices — 2026-09-23

- Historical rule: the expanded 21-entry batch originally required approval as a whole. Julio superseded that rule on September 25 with individual approved submissions for later import. The current policy is recorded above. Unresolved passage comments still keep an entry on hold; readiness is not an automatic import.
- The editorial review supports selecting prose and adding comments to that exact passage. Preserve existing general notes and decisions under the same browser storage key. Keep earlier-draft comments visible with their original quotation when the text changes. Comments, notes and decisions are included in the review export.
- Literature uses flat front-cover artwork filling a fixed 600:927 rectangle with sharp corners on a gray stage, matching Animal Farm C. Do not use photographed spines, perspective mockups, or external image margins. Gatsby and Vidas Secas received three replacement choices; the unchanged Animal Farm C choice is preserved.
- The initial four-medium review covered painting, music, cinema and literature. Julio later reopened all seven media. The September 25 decisions now govern individual entry status; theater remains on hold. Retain earlier drafts, visual experiments and research.
- Latest architecture choice: Julio prefers **round 4 B, the Dupérac engraving of St Peter’s**, most. Treat its detailed historic etched/engraved elevation as the primary thumbnail reference. The original White House ink-and-wash B remains an earlier selected direction. St Paul’s engraved section is an unselected alternative. Keep the rejected modern examples archived; do not treat them as accepted templates. The review choice is saved under `architecture-round-4`; editorial release remains separate.
- Architecture uses a consistent **2D engraving and architectural-drawing family**, including modern buildings. Julio selected the first study’s White House B, then broadened the direction: warm archival paper is one option, alongside clean white-paper linework, monochrome hatching and other documented 2D plans or elevations. Do not make every image yellow or watercolor. Prefer existing documented drawings; identify generated treatments and check them against the source. Preserve real geometry and distinguish proposals from built work. Do not invent period ornament, archival signatures or undocumented façades.
- Sculpture follows **round 2 option C, the Roman woman’s head**: a near-black upper background, subtle charcoal below, generous headroom and a large, visually eye-level face. Frontal and profile views are acceptable. Crop irrelevant stands and pedestals out of thumbnails; do not let them reduce the face’s size. This refines the earlier Caracalla C direction. Prefer original photographs that fit. AI background edits are allowed, but preserve the object’s identity, pose, material, color and damage; do not restore features or invent a viewpoint. Keep original images available for comparison. Round 3 revises Franklin’s framing and varies architecture paper treatments; earlier rounds and feedback stay preserved.
- Latest visual feedback: round 3 architecture B (Farnsworth measured elevation) and C (Neue Nationalgalerie hatching) were rejected; retain A and try different engravings. Round 4 tests richer historic prints. Sculpture A is liked; Franklin B is acceptable in direction but needs clearer detail and no dark wedges at the two bottom corners. Prefer better original sources first. Disclose generated foreground changes and do not claim restored authentic detail.
- New visual rounds preserve earlier selections and use independent feedback groups. Their preferences do not approve individual entries. Source and handoff: `docs/editorial/batches/batch-001/visual-study/elevation-portrait/`.
- Provide three distinct, verified image candidates per entry, labeled A/B/C. Source and assess quality before asking Julio to choose. Do not use three resizes or artificial color grades as alternatives.
- Music keeps the fixed photographic vinyl surround in `docs/editorial/batches/batch-001/visual-study/vinyl_template.py`; only center artwork changes. Cinema uses three original downloaded frames, displayed locally without requiring ShotDeck navigation. Painting reproductions and book/album editions must be accurately identified.
- Workflow: `docs/editorial/IMAGE_REVIEW_WORKFLOW.md`. Active review: `http://127.0.0.1:4184/REVIEW.html`; now 20 queued entries and 60 image choices after SESC Pompeia's removal. Writing decisions and image preferences are independent. All unreviewed entries remain pending; no automatic database import or publication.
- Review selections save in browser storage and can be exported. Preserve the source records, paused entries, provenance, approval boundaries and persistent review service.



- Architecture follows the selected detailed 2D engraving/drawing direction; historical proposals and reconstructions must be identified. Sculpture uses close source-based portraits against dark backgrounds, preserving identity and disclosed viewpoint limits. Theater uses accurately identified stage photographs, posters, playbills or edition material. New image manifests retain source provenance; all seven-medium checks are recorded in `docs/editorial/batches/batch-001/qa-seven-mediums/verification.md`.

## Sprint foundation and prompted updates — 2026-09-23

- The sprint-plan reference area shows only **References · previous sprints**. Do not add sprint names, point totals, or empty-state copy there. Task cards have no profile picture or initials; align their date to the left. This supersedes the older reference-value and card-avatar guidance below.
- `app/src/scrum/projectUpdates.ts` holds immutable, append-only reviewed update batches. The model applies each batch once to new and existing boards. Preserve personal edits, existing epic codes, and task order. Keep Sprint 1 on August 31–September 13 and Sprint 2 on September 14–27.
- Julio primarily requests ticket changes verbally. Use the current request, relevant project chats, and verified source evidence to create or move tasks. Append a guarded change for each authorized update; never replace personal data with fresh seed records. This is a prompted workflow, not automatic chat synchronization.
- Done records a scoped, verified artifact or submission receipt. Keep visual/editorial approval, grades, publication, and reader findings separate. Do not infer participant results from interface work or a prepared study.
- Handoff: `docs/SCRUM_WORKSPACE.md`. Verification record: `qa/sprint-foundation-2026-09-23/verification.md`; consult it for completed checks and limits.

## Saved-by interaction and reading spacing — 2026-09-23

- The two circles now represent the latest sample savers. The avatar/count group is one native button opening a phone-scoped saved-by sheet. It does not save the work. Use neutral monogram avatars until real profile images exist. The current prototype reader appears first after saving and has no Follow action.
- The sheet adapts Julio's Savee screenshot with a handle, centered count heading, scrolling people rows, and shared Follow buttons. Use 24px upper corners, 20px insets, 40px avatars, 60px rows, 16/20 heading, 14/18 names, and 12/16 handles. Retain Light/Dark, all four locales, safe areas, Escape/overlay/handle dismissal, focus restoration, and reduced motion.
- Records are fictional and the sheet says **Sample profiles**. Socrates shows all 65 sample peers, or 66 including the current reader. Other larger sample counts show at most 65 peers. People follows use `daily-culture-followed-people-v1`, independently from artwork saves and creator follows. Study routes remain temporary. This is a local prototype, not authenticated social activity.
- Save rolls only changed count digits upward over 240ms; unsave reverses direction. Keep the plus sign and unchanged digits still. Rapid reversals settle on the latest count. No mount animation; reduced motion changes immediately. Preserve 8/10 proportional typography, zero tracking, and 20px action surfaces. Leave the full-screen control and selected Light glass menu unchanged.
- Latest spacing correction: default Socrates title-to-creator line-box gap is **2px**, final paragraph-to-Last edited gap **24px**, and Last edited-to-Technical information gap **56px**. The title correction uses a -2px creator top margin after the 20px action row. The Last edited text uses the existing medium text tone at 60% opacity, making it the faintest reading text without adding a solid palette swatch. This supersedes earlier spacing values below.
- Source: `app/src/TodaySaveActions.tsx`, `TodaySaversSheet.tsx`, `today-savers.ts`, their CSS, and `prototype.css`. Handoff and checks: `qa/today-savers-motion-2026-09-23/verification.md`. Visual approval remains Julio's decision.

## Today saves and boards — 2026-09-23

- Julio's Paper action group at node 1TC-0 supplies the Today control structure: two overlapping dark-red circles, a `+count` pill, a text-only Save/Saved split control, and a separate expand circle with Paper's diagonal `open_in_full` glyph. After reviewing the 16px Paper-sized version, Julio asked to align the controls with the 20px date and Search controls above the artwork. The current row keeps 20px surfaces and 8px group gaps; the `+count` and Save/Saved labels share 8px/10px typography. Use proportional numerals, normal kerning, and zero tracking for the count after Julio found the `65` too widely spaced. The expand control remains unchanged, with a roughly 5px glyph inside its 20px circle. Keep the existing Save, board, and viewer logic. PP Neue Montreal replaces Paper's Helvetica Neue; dark mode uses a readable surface. Source: `app/src/TodaySaveActions.tsx` and `app/src/today-save-actions.css`. Handoff: `qa/today-actions-paper-2026-09-23/verification.md`.
- The updated Paper Daily screen adds a date/Search row before the image. Today's title row now shows a tappable saved-by-people sample count, split Save/board controls, and a full-screen action. Keep the real Socrates metadata; the Paper Dante text is placeholder content.
- Quick Save persists globally. A piece can belong to multiple personal boards or none. Board removal does not unsave it; global unsave clears memberships. Existing favourites migrate into the default board without losing saved state. The count is prototype sample data, not measured user activity.
- Keep chronological Daily navigation, the existing full-screen viewer, PP Neue Montreal, monochrome UI, four locales, both phone previews, and protected runtime. The Paper shuffle control is omitted under the prior no-shuffle decision. Handoff and checks: `qa/today-save-2026-09-23/verification.md`.

## Floating menu study — 2026-09-23

- Julio requested a floating five-control menu inspired by the supplied Savee screenshots. The destinations are Daily, one merged Search/Discover page, a new Create placeholder, Favourites, and Settings through a profile symbol. The screenshots are visual references, not product instructions or an avatar source.
- Julio selected Light glass as the new menu. Its 248 × 52px, 78%-opacity light capsule with 16px backdrop blur is the app's base style. Use a 24%-opacity white border and 18%-opacity inset highlight in Light; Dark uses the charcoal treatment above. The latest spacing correction uses fixed 44 × 44px targets and equal 4px visible insets at both capsule ends and above/below the selected circle. The solid and outline variations remain unchanged at `http://127.0.0.1:4173/menu-study.html` for comparison; their query parameters do not change the standard menu.
- Search keeps Discover collections, shortcuts, gallery, and art-form filters. Its query also searches story text and offers the old Search field filters for place, art form, and creator. Browse state survives tab changes. Create shows only a translated placeholder; its flow is not designed.
- Keep the menu outside `MobileScroll`, clear the protected device controls, hide it while the keyboard is open or a detail is shown, and honor reduced motion. Keep the three-gray palette, PP Neue Montreal, and five 44px-or-larger targets. Source: `app/src/Prototype.tsx`, `app/src/prototype.css`, `app/src/discover.css`, `app/src/design-system/NavigationIcon.tsx`. Handoff: `qa/floating-menu-2026-09-23/verification.md`.

## Taste naming and process refinement — 2026-09-23

- The versioned public app label is **Taste (V1.2)** across project metadata, localized copy, accessible labels, browser titles, and new downloads. The later wordmark decision uses **Taste** in brand positions. `app/src/brand.ts` owns `APP_NAME`, `APP_VERSION`, and `APP_LABEL`. Preserve legacy storage keys, internal IDs, CSS prefixes, source filenames, preview service labels, and historical references; they do not require a project-folder rename.
- The shared top bar reads **Taste (V1.2) / Project Management**. Process documentation has no Export or Import controls. Retain existing browser data and legacy validation/migration support; saved edits must survive the rename.
- Sprint plan starts with an editable **Sprint name**, with no date/status subtitle. **References · previous sprints** shows the stored story-point totals of completed tasks in earlier closed sprints. Keep these as planning references, not invented velocity. Preserve underlying sprint dates and the two-week schedule.
- Remove Reflection from sprint planning and creation. A separate optional **Retrospective** opens for closed sprints and after **Complete sprint**. Completion remains immediate, keeps done work in the sprint, and returns unfinished work to the backlog. Cancelling the retrospective does not undo completion. Preserve saved reflection and legacy note fields.
- Use the existing Motion dependency for restrained Process interactions: search focus and clear control 150ms, view crossfade 180ms, moving tab underline 250ms, and dialog transition 200ms. Keep the 4–8px corners, compact monochrome styling, keyboard focus, and immediate reduced-motion states. Preserve the selected creator Slide back behavior below.
- Current handoff: `docs/SCRUM_WORKSPACE.md` and `docs/DESIGN_SYSTEM.md`. Verification record: `qa/taste-refinement-2026-09-23/verification.md`. Browser verification and visual acceptance are separate; consult that record for completed checks. This update supersedes the older public name, backup controls, and Reflection-in-plan guidance below.

## Process documentation and epic codes — 2026-09-23

- Rename the user-facing Scrum workspace to **Process documentation**. Preserve `?view=scrum`, `daily-culture-scrum-v1`, existing source filenames, and the Scrum explanation in About.
- Use three task stages: **To do**, **In progress**, and **Done**. Normalize saved or imported legacy `review` tasks to `in-progress` without dropping records.
- Existing tasks are grouped by content into Product Design (PD), Engineering (ENG), Editorial (ED), User Research (UR), and Capstone Planning (CP). Display sequential epic codes such as `PD-001` while preserving internal task IDs, saved edits, task order, and historical evidence.
- Task details include an **Epic** selector with **New epic…**, **Epic name**, and **Code prefix**. Allocate numbers only on save. Existing codes stay stable within an epic; moving a task to another epic assigns its next number. Cancel must not create an epic or consume a number.
- Use simple default sprint names, **Sprint 1** and **Sprint 2**. Replace only the exact original seeded names on migration; preserve custom names. Handoff: `docs/SCRUM_WORKSPACE.md`; verification record: `qa/process-epics-2026-09-23/verification.md`. This supersedes the older workspace label and four-stage workflow below.

## Selected creator motion — 2026-09-23

- Julio found the shrink-to-source dismissal unsuitable for Daily Culture's reading layout. Preserve the reference's continuity and responsiveness, but do not treat the source control as a gallery tile. He requested three variations to review before choosing a replacement.
- Julio selected **Slide back**, describing it as smoother and more aligned with the brand. It is now the default: the opaque, full-size artist page slides right over 320ms, while the underlying page moves from -6% horizontally to its resting position. No shrink, downward motion, changing corners, or close fade. Reduced motion changes immediately.
- Compare the retained Slide back, Short glide, and Soft dissolve variants at `http://127.0.0.1:4173/motion-study.html`. Explicit `creator-motion-study` query parameters enable the alternatives; study preferences, follows, and favourites stay temporary. Keep scroll retention and restore focus only after the parent becomes interactive again.
- Source: `app/public/motion-study.html`, `app/src/CreatorPageTransition.tsx`, and `Prototype.tsx`. Handoff: `qa/creator-motion-variations-2026-09-23/verification.md`. This selection supersedes the shrink-to-source dismissal below.

## Creator-page dismissal — 2026-09-23

- Artist profiles now use an app-owned layer over the retained parent page. Back or Escape contracts the rounded page toward its opening control over 400ms, with a final 220ms fade. Opening uses 280ms. Reduced motion changes immediately. This adapts Julio's September 22 recording; it does not add gesture-driven dismissal.
- Preserve parent scroll and selected sections, inert background, focus restoration, creator design, and protected device chrome. Source: `app/src/CreatorPageTransition.tsx`, `app/src/creator-page-transition.css`, and navigation in `Prototype.tsx`. Handoff: `qa/creator-dismiss-2026-09-23/verification.md`. Local implementation awaits Julio's visual review.

## Creator profiles and museum-style navigation — 2026-09-22

- Creator profiles follow Julio's supplied Artsy-style screenshot: a 275px artwork hero filling the phone width, 28/32 name and place/date text, and a single shared Follow control, then Overview, Biography, and Artworks tabs. Use PP Neue Montreal, semantic colors, 20px content insets, 16/26 prose, and 214px square artwork cards. Source: `app/src/creator-profile.css` and `CreatorDetail` in `app/src/Prototype.tsx`.
- Preserve the existing creator records, verified biographies, follow persistence, and actual artwork counts. Do not add placeholder follower counts, prices, or screenshot overlay avatars. Unknown-maker dates use Period, not Lifetime. Tabs support keyboard navigation; Sort & Filter supports title order and saved works. Remove Share from creator profiles. The scoped Follow variation has 4px corners, a 104 × 32px minimum size, dark Follow and outlined Following states; coarse pointers retain 44px height. The back square and chevron are 20% smaller: 24px and 16px inside a 44px target. Artwork cards show the title in normal case, then creator and year; omit the medium label. One 1px underline moves between tabs over 260ms with reduced-motion support.
- Latest menu correction supersedes the rounded icon experiment: use restrained 24px house, compass, magnifier, heart, and gear symbols with 1.5px inactive outlines and solid active fills. `NavigationIcon.tsx` uses only a 160ms opacity fade on activation, without movement or mount animation. Reduced motion changes state immediately. Preserve labels, hit targets, and menu geometry.
- Latest refinement checks: `qa/creator-refinement-2026-09-22/verification.md`. Original reference measurements: `qa/creator-reference-2026-09-21/verification.md`. Local implementation awaits Julio's visual review.

## Discover and menu refinement — 2026-09-21

- Julio requested Discover follow Paper node 1UV-0. Use the measured 4px insets, compact search/filter row, 243 × 182px collection rail, 2-by-2 discovery tiles, four-column gallery, and category tiles. Keep PP Neue Montreal and the shared monochrome palette. Do not restore the redundant visible Daily Culture/Discover headings.
- `app/src/discover.css` owns this screen. Search, art-form filters, discovery shortcuts, grid/list switching, and existing artwork/collection navigation are functional. Preserve the browse state when returning from details. Collection counts derive from actual records; popularity uses prototype sample counts.
- The initial rounded menu icons and 260ms settle are superseded by the September 22 museum-style navigation correction above.
- Increase both gaps marked in Julio's screenshot by 16px: Last edited → Technical information uses 48px reading bottom padding; creator card → Check out more uses 40px section margin. This supersedes the earlier 32px/24px spacing.
- Reference measurements, deliberate adaptations, and verification: `qa/discover-paper-2026-09-21/verification.md`. Local variation awaits visual review.

## Related cards and Discover cleanup — 2026-09-21

- Julio chose horizontal cards with consistent image sizes for Check out more. The local redesign uses 208px cards with 208 × 156px crops, 8px corners/gaps, and pale semantic surfaces. Show title, creator, and date on separate lines with compact PP Neue Montreal. Preserve recorded image focal positions, the protected Carousel, localized accessible names, and existing related-work selection/navigation. This visual variation awaits review.
- Remove Daily Culture and Discover from the top of Discover. The featured collection starts the visible page; retain a localized accessible main label.
- Handoff and checks: `qa/related-cards-2026-09-21/verification.md`.

## Reading and viewer refinement — 2026-09-21

- Latest correction: remove the divider between the category labels and story text, and reduce that gap by 16px total. Reading top padding is 0; metadata bottom padding remains 16.5px.
- Latest viewer correction: title and creator/date use 14px / 18px, reducing both by 2px. Close and download circles and their icons are 20% smaller; visible circles are 35.2px with unchanged 44px touch targets. Preserve the bottom-left caption anchor, glass opacity, current crop, native-resolution tiles, and gestures. This supersedes the 16px caption decision below.
- Keep 48px between Last edited and Technical information after the latest gap increase. Remove only the divider above Technical information; retain its heading underline and card borders.
- Remove reader-facing source and editorial-project boilerplate from Daily and artwork details. Keep source, rights, and editorial ownership in records and documentation.
- The Death of Socrates now has a four-sentence analysis in two paragraphs, with matching translations. Follow the current editorial guide and museum evidence; the four-sentence request is specific to this entry. Editorial and visual approval remain Julio's decision. Handoff: `qa/daily-editorial-2026-09-21/verification.md`.

## Scrum simplicity and corners — 2026-09-21

- Remove Area and Priority from all Scrum UI: task fields, badges, list columns, sprint-plan metadata, filters, and sorting. Preserve legacy values and new-record defaults solely for existing backup compatibility. Story points remain effort estimates; manual order and due dates guide sequence.
- Julio rejected the large Scrum radii and dark hover outlines. Use 4–8px corners for Scrum surfaces and controls, subtle gray hover feedback, and visible keyboard focus. Avatars and status dots remain circular. This supersedes earlier pill-shaped Scrum controls and large rounded task/week cards, without changing the Prototype or Design system defaults.

## Compact save toast — 2026-09-21

- Julio requested a smaller, smoother save toast inspired by Emil Kowalski. The app toast is 30px tall with 12/16 type, 7px × 12px padding, and a content-sized pill.
- Use interruptible CSS transitions: 6px rise, scale .96 → 1, and 2px → 0 blur; enter over 220ms and exit over 160ms. Retain the message through dismissal so the pill does not collapse. Repeated notifications reset the 1.8-second timeout; clear it on unmount.
- Keep existing localized messages, theme colors, pointer pass-through, and polite screen-reader announcements. Reduced motion removes movement and blur. Handoff: `qa/compact-toast-2026-09-21/verification.md`.

## Follow button micro-interaction — 2026-09-21

- Latest correction: Julio found the Follow and Following stroke too dark. Use the shared divider color for both resting borders; keep label/check contrast and keyboard focus. Hover/press borders match their existing inverted fill.
- Julio requested hover, press, and animated Follow/Following states. Use shared `app/src/design-system/FollowButton.tsx` in creator cards and the library.
- Reserve both translated labels to keep width stable. Use a 240ms, 5px label crossfade/slide, a small drawn checkmark, monochrome hover inversion, and restrained press compression. Saved state does not animate on mount; transitions can reverse immediately.
- Keep native click and `aria-pressed`, visible keyboard focus, accessible names containing the visible label, and drag-scroll suppression. Reduced motion removes the movement. Preserve local follow persistence and isolated library preview state.
- Handoff and focused checks: `qa/follow-interaction-2026-09-21/verification.md`. Implementation awaits visual review.

## Stable like counts and three-gray palette — 2026-09-21

- Latest correction: Julio rejected the wide reserved count slot. Like pills now hug their contents. Use the font’s tabular numerals with kerning disabled so equal-length counts stay stable; animate the natural count width over 180ms only when its length changes. Remove the 7ch slot and 96px detail width. Preserve Today’s 20px height, 8/10 typography, original heart, subtle pulse, and icon-only controls. Reduced motion snaps directly to the new width. Current evidence: `qa/compact-like-counts-2026-09-21/verification.md`.
- The shared interface palette uses dark `#252525`, medium `#6e6e6e`, and light `#f2f2f2`, plus a white canvas. Use semantic aliases from these primitives instead of extra solid grays. Today category text uses medium gray. Keep artwork colors and protected device chrome unchanged.
- Dark mode reuses the same palette, with light text on dark surfaces. Image-viewer glass and shadows remain effects, not additional palette swatches.
- Build, runtime, export, count-width, theme, and localized-count verification: `qa/stable-likes-palette-2026-09-21/verification.md`.

## Artwork technical information and creator follow — 2026-09-21

- Julio requested Technical information after the artwork description, then a bordered creator biography with Follow. Match the supplied reference's thin borders, underlined heading, circular artwork thumbnail, and outlined pill using compact PP Neue Montreal and monochrome colors.
- Shared components: `app/src/design-system/ArtworkInformation.tsx`. Daily and standalone details use the same panels; the design-system library includes an isolated Preview / Code example. Preserve exact Today geometry above this addition.
- Follow persists locally under `daily-culture-followed-creators-v1`, is shared with creator profiles, and appears in Favourites → Creators. Library demo state stays separate. Unknown makers have context and no Follow action.
- Respect all four locales, units, themes, and reader text preferences. Use verified physical dimensions only; omit unknown measurements, signature, and framing. Do not substitute image dimensions or poster materials for artwork facts.
- Handoff, sources, and verification: `qa/artwork-information-2026-09-21/`. Build, protected runtime, and focused browser checks passed. The local variation awaits Julio's visual review.

## Like button motion — 2026-09-21

- Julio requested a simple, subtle like animation shared by Prototype and Design system. Use the existing Motion dependency in `app/src/design-system/LikeButton.tsx`; animate only the heart, with a 320ms restrained pulse on like and a 180ms release on unlike.
- Keep the monochrome icon, native button semantics, immediate saved state, and existing hit area. Today retains its exact Paper SVG, 20px control height, and 8/10 count typography. No particles, color accents, rotation, sound, or automatic animation on mount. Reduced motion changes state immediately.
- The library exposes **Components → Like button**, with Preview / Code and a disabled example. Story and collection favourite actions use the same component. Visual acceptance remains Julio's decision.
- Verification and captures: `qa/like-animation-2026-09-21/verification.md`. Production build and protected runtime checks passed; browser checks covered both phone previews, keyboard toggles, saved state, swipe behavior, and library light/dark appearances.

## Rounded surfaces and selection motion — 2026-09-21

- Julio explicitly likes the supplied pale-gray rounded-card/pill reference and Annnimate Morphing Select motion. He authorized implementation across Prototype, Design system, and Scrum.
- Handoff and preserved references: `docs/design/ROUNDED_SURFACES_AND_MORPHING_SELECT.md`. Shared components live in `app/src/design-system/MorphingSelect.tsx` and `SelectionPill.tsx`.
- The shared workspace selector and Scrum selection fields use morphing menus. Prototype Settings/Search use moving gray selection pills within existing controls and sheets. The library includes interactive examples, including the slower reference motion. Gray rounded surfaces apply selectively to Scrum cards/week groups and prototype library/collection groups.
- Keep PP Neue Montreal, compact sizing, monochrome focus, readable contrast, exact Today geometry, and the protected phone runtime. The supplied code's Switzer, orange focus, fixed size, and “paste as-is” instructions do not override these decisions.
- Local checks and screenshots: `qa/morphing-selection-2026-09-21/verification.md`. Browser tests cover desktop, narrow layouts, both phone previews, and keyboard behavior; visual acceptance remains Julio's decision.

## Personal Scrum workspace — 2026-09-21

- The browser workspace selector now has Prototype, Design system, and Scrum. Local route: `http://127.0.0.1:4173/?view=scrum`.
- Julio requested Asana-like project-management UX with Jira-style Scrum planning. Keep the monochrome, PP Neue Montreal workspace separate from the protected phone runtime.
- Handoff: `docs/SCRUM_WORKSPACE.md`; evidence-backed history: `docs/SCRUM_HISTORY.md`; framework validation: `docs/SCRUM_VALIDATION.md`.
- Source: `app/src/scrum/`. Data persists independently in browser storage as `daily-culture-scrum-v1`; provide Export/Import. Never replace saved personal edits when updating seed records.
- Two initial sprints run August 31–September 13 and September 14–27. The first three project weeks are reconstructed from dated records. They are not academic week numbers or evidence of historical Scrum meetings.
- Fourteen completed tasks record narrow delivered scopes. Six September 21–27 tasks are proposed, totaling 13 provisional points; two backlog items remain unestimated. Past points are retrospective estimates, never measured velocity.
- Keep historical work, actual approvals, reader findings, and academic submissions distinct. The board is a personal Scrum adaptation, not a claim of full Scrum practice.
- New sprints last 14 days and cannot overlap. Completing a sprint keeps done work and returns unfinished work to the backlog. Task completion is a direct status change; Julio removed the acceptance-check and Definition of Done gates.
- Latest cleanup: remove board column counts/points, card point badges, reconstruction footer, sprint status pill, Personal badge, main-header book icon, Next 7 days filter, empty-column filler, and sidebar explanation/save-status text. Keep functional backup controls, sprint goals/dates/progress, and point editing.
- Task details use core fields and one Description. No separate acceptance criteria, Definition of Done, Project record, Evidence, or outcome-note sections. Existing useful criteria, custom notes, and source paths consolidate into Description on edit; keep legacy data and historical provenance in stored records and project documentation. Do not repeat generic estimate or provenance explanations in normal task copy.
- Latest navigation: Prototype, Design system, and Scrum share a 44px dark top bar labeled **Daily Culture / Project Management**. Scrum navigation is **About**, **Sprint board**, **Product backlog**, in that order. About is one read-only description of Scrum, the Scrum Guide, and this project. Remove the workspace breadcrumb and archive navigation; legacy archived tasks remain accessible through the backlog. Keep the sidebar project title and subtitle close together.
- Sprint plan uses one optional **Reflection** field and a standalone **Complete sprint** button. Existing planning, review, retrospective, and improvement notes appear together until Reflection is edited; preserve the original fields in stored records. An intentionally empty Reflection stays empty. Sprint completion has no reflection requirement. Current handoff and checks: `qa/workspace-navigation-2026-09-21/verification.md`.
- Preserve the persistent preview service. This workspace remains local and does not send messages, submit assignments, or schedule events.

## Project files

- Product specification: `docs/PRODUCT_SPEC.md`
- Public-reference notes: `docs/REFERENCE_NOTES.md`
- Visual comparison notes and captures: `qa/`
- Prototype source: `app/src/Prototype.tsx` and `app/src/prototype.css`
- Content image rights: `app/public/assets/content/README.md`

This is a clean-room DailyArt-inspired prototype. Do not copy DailyArt code, branding, writing, databases, or restricted media.

Keep Julio's editorial authorship explicit. Treat sample stories as prototype content until Julio reviews them.

## Settings refinement — 2026-09-20

- Make the entire cultural-library card a single button, including its image, text, and surrounding space. It opens the existing Favourites tab. Preserve drag-to-scroll and keyboard activation.
- The intended product signs users in during onboarding and keeps their session. Settings offers **Switch Accounts**, replacing Sign In. The September 24 local preview above provides simulated account switching without real authentication.
- Story repeats offers Every week, Every month, Every 6 months, Every year, and Never repeat, in that order. Preserve existing saved choices and persist the new intervals. This remains a preference in the prototype, not a live content scheduler.
- Remove the Daily Culture brand line from the Settings header and the “Made for slower looking and deeper reading” footer. Keep the Settings heading and other page headers.
- Keep all four locales and the existing PP Neue Montreal, monochrome controls, and protected phone runtime. Handoff and verification: `qa/settings-2026-09-20/`.

## Current visual direction — compact monochrome, 2026-09-20

- **Latest viewer correction:** Open into the crop from Julio's second screenshot, with the landscape image about 72% of the phone height and Socrates near the center. Fetch native detail on open. Draw the image at its actual displayed dimensions; permanent `will-change` plus scale transforms softened the previous rendering. Use a visible center-out tile reveal, including cached opens. Both captions now use 16px / 20px; the creator line includes the production date. The current approximate-date abbreviation is **c.**, per the newer rule above. Glass gradient fill alpha is 20% lower (33.6% / 22.4%). This supersedes the fit-on-open and 14px notes below. Current evidence: `qa/viewer-opening-2026-09-20/`.
- **Landscape zoom example:** Julio could not see the tile sharpening with Dante and requested a higher-resolution, horizontal David painting. Today now features Jacques-Louis David's *The Death of Socrates* (1787), using the Met's 4000 × 2663 public-domain image. Dante remains the preceding edition. Do not describe the refinement as visually approved; source and historical checks are in `qa/david-viewer-2026-09-20/`.
- **Latest zoom experiment:** Julio requested the feeling of National Gallery's tiled zoom. Opening still fits the complete image. Tapping a detail inside the viewer now zooms toward that point by 1.6× over 340ms; double-tap toggles 2.5×/fit. Native-resolution 512px tiles fade over the preview when decoded. Pinch, wheel, and drag stay direct; reduced motion skips animation. Keep the original download file and the two-control composition below. This local experiment awaits Julio's visual review. Handoff: `qa/gallery-zoom-2026-09-20/implementation.md`.
- **Latest image viewer direction:** A black, full-phone image canvas with only close at top right, icon-only download at bottom right, and title/creator at bottom left. Use subtle translucent gradient/blur controls. Viewer title and creator both use 14px type with 18px line height; preserve the existing bottom-left anchor and 2px gap. Fit the complete image initially; zoom and pan across the whole viewport behind the overlays. No visible zoom buttons, reset, percentage, dimensions, instructions, or source credit inside the viewer. Keep source attribution on the story, hidden accessible instructions, keyboard shortcuts, pinch/wheel/double-tap zoom, and loading/error recovery. Evidence: `qa/minimal-viewer-2026-09-20/`.
- **Latest font and image interaction decision:** Use PP Neue Montreal throughout all app-owned screens and the design-system library, including likes and category labels. This supersedes Inter and Helvetica substitutions. Preserve current type sizes and Paper geometry. Tapping the Today artwork opens the same high-resolution viewer as the magnifier; dragging still scrolls or changes editions. Protected device chrome keeps its native fonts.
- **Latest Today correction:** Julio rejected the enlarged typography and controls. Default Today/Daily must use Paper's exact sizes and installed PP Neue Montreal TT Regular. The general compact defaults below apply elsewhere. See the Today section and `qa/today-paper-exact-2026-09-20/`.
- Julio rejected blue and other colored UI accents. Use only black, white, and gray for UI, including focus and selected states. Artwork retains its colors.
- Use his Paper [Search, node 1UV-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1UV-0) and [Daily, node 1QL-0](https://app.paper.design/file/01M1R94SC3XBC0KVTMZHT2P9EC/3-0/1QL-0) directly for compact components and patterns.
- Active handoff: `docs/DESIGN_SYSTEM.md`. Fresh measurements: `qa/design-system-monochrome-2026-09-20/paper-*.jsx.txt`. This direction supersedes the September 19 blue accents and larger design-system defaults.
- Type size/line-height: caption 10/12, label 12/16, body 14/20, section 16/20, title 20/24, display 32/40. Use locally installed PP Neue Montreal across the app and library. Bundled Inter remains available for protected preview chrome.
- Buttons: 32px high/12px label; small 28px/11px. Chips: 24px high/11px label. Use 4px control gaps; expand controls to at least 44px on coarse pointers without overlapping targets.
- Patterns use a 393px canvas, 4px outer padding, 4px text insets, 4px gallery gaps, and 8px related-group gaps. Search follows the 243 × 182px featured rail, two-by-two discovery tiles, then four-column gallery.
- The 14/20 body and larger chip labels deliberately adapt Paper's smaller text. Record such adaptations explicitly. Paper's orange active bar is not adopted.
- Preserve Geist library organization and keyboard behavior while densifying its documentation. Current library dimensions are in `docs/DESIGN_SYSTEM.md`. `ArtworkCard` uses optional `density="compact"`, with title/creator/context metadata, a 4px image gap, and 2px internal gaps. Default app-card geometry stays intact.
- `patterns.css` owns the compact Daily/Search pattern styles. Compare the two canvases side by side above 1000px and stack them at narrower widths; each has a 393px maximum width.
- Shared monochrome focus colors apply to the app too. Verify selected-chip foreground contrast in Light and Dark. Preserve app behavior, runtime, reader preferences, locales, drafts, and content rights.
- Do not edit Paper or imply automatic synchronization. The design-system library remains an interactive catalog with reusable code, not a visual component editor.
- v0.2 local implementation checks passed. Current evidence and limits are in `qa/design-system-monochrome-2026-09-20/verification.md`. Julio's visual approval is still pending.

## Related Minerva University context — 2026-09-07

### Latest academic refresh — 2026-09-19

- Read `docs/academic/ACADEMIC_CONTEXT_UPDATE_2026-09-19.md` before relying on the September 7 academic references.
- It links the current Minerva memory and source evidence for recent emails, classes, reflections, assignments, and feedback.
- The track now uses biweekly reflections; preserve the unresolved Project Brief deadline conflict and distinguish submission receipts from grades.
- Recheck dated status before future action. This is a contextual cross-reference, not automatic synchronization.

- Julio explicitly connects this capstone with his broader **Minerva University** project. Consult related academic context when it materially helps an assignment, evaluation, research decision, or Daily Culture product decision.
- Verified ChatGPT project: **Minerva University**, project ID `g-p-6a89d093863481918e4400fecdef39c1`.
- Verified desktop folder: `/Users/juliocaggiano/Desktop/CLAUDE:CODEX/Minerva University`. At discovery, it contained `B199` coursework; do not assume it mirrors every ChatGPT project file or conversation.
- Relevant shared context can include coursework, HCs/LOs, rubrics, professor feedback, research, and graduation requirements. Read the specific source before applying it. Preserve assignment-specific requirements and the capstone track's precedence over general handbook defaults.
- Capstone academic sources are preserved in `docs/academic/CAPSTONE_HANDBOOK_REFERENCE.md` and `docs/academic/CAPSTONE_TRACK_REFERENCE.md`. Follow the handbook's attribution rules when incorporating prior coursework.
- This connection is a contextual cross-reference. It does not establish automatic synchronization or authorize moving, merging, or renaming folders.

## Confirmed prototype decisions — 2026-09-05

- Daily supports one-day-at-a-time horizontal dragging through the protected `Carousel`, while each story keeps independent vertical scrolling.
- Today is the Daily anchor. Julio's latest direction request inverts the earlier mapping: a physical rightward pointer or finger drag reaches older editions one at a time. A physical leftward drag moves toward Today, then reaches the contribution invitation.
- Verify direction by pointer coordinates: `endX < startX` reaches a newer edition or Suggestion from Today; `endX > startX` reaches an older edition. Keep the protected natural drag behavior. Render pages left to right as `Older editions | Yesterday | Today | Suggestion`. Match keyboard arrows to these named swipe directions.
- Choose the Daily destination from the whole drag, before release momentum. A brief reversal before releasing must not send the reader to the opposite destination. Short or cancelled drags stay on the current edition; nested recommendation rails keep their own gestures.
- Daily also maps horizontal browser scrolling right to older editions and left to newer editions or Suggestion. Handle this in app-owned Daily code: positive wheel deltaX opens older editions, negative opens newer. Each scrolling burst advances at most one edition, including its momentum tail. Preserve vertical reading, pinch zoom, and native scrolling in nested recommendation rails.
- Do not add a random, shuffle, or “show another story” button to Daily. Preserve chronological swipe navigation and its keyboard access.
- The contribution invitation opens a localized prototype form with optional image previews. It does not transmit data until a submission service is connected.
- Keep contribution intake limited to an art piece, person, or cultural practice; why it matters; optional sources or links; and optional images. Do not ask for a name, email, or separate culture, place, or community field.
- Preserve unfinished contribution fields and local image previews across sheet dismissal during the current app session.
- The four locales are `en`, `pt-BR`, `it`, and `es`. Each locale translates visible interface text and draft stories.
- Settings includes a clear Switch Accounts prototype state, Notifications, a Widget preview, Units, reader Text Size, and Light, Dark, or System theme controls. The September 20 Settings decision supersedes the earlier Sign In entry.
- Preferences and favourites persist in local browser storage. Account and cross-device sync remain prototype states.
- The web prototype only simulates notifications and widget behavior.
- Roslindale Display Condensed is the inferred reference typeface. Use Newsreader until Julio supplies licensed Roslindale files.
- The active Favourites underline follows its label width and uses a 1px stroke.
- Keep Daily action geometry stable. Use 13px for the favourite count and 14px for the creator name inside its pill.

## Persistent local preview

- Service label: `com.juliocaggiano.daily-culture-preview`
- URL: `http://127.0.0.1:4173/`
- Build before previewing: `cd app && npm run build`
- Restart: `launchctl kickstart -k gui/$(id -u)/com.juliocaggiano.daily-culture-preview`
- Standard output: `app/.preview/stdout.log`
- Errors: `app/.preview/stderr.log`

The service serves `app/dist/client`. Keep the project local unless Julio requests deployment.

## Current visual exploration — 2026-09-05

Historical direction. The Artsy exploration below supersedes this visual direction from 2026-09-19.

- Julio requested a reimagining inspired by MoMA's website and wider design choices.
- Design direction and observed reference evidence: `docs/MOMA_DESIGN_DIRECTION.md`.
- This authorizes the exploration. It does not confirm Julio's approval of final visual details.
- The current exploration supersedes the earlier DailyArt-derived typography, dark-first presentation, rounded treatments, and visual geometry where they conflict. Keep the previous entries as historical decisions.
- Use licensed, bundled Inter with strong sans-serif headings, white and near-black foundations, bright editorial panels, and square exhibition blocks.
- Fresh preferences default to Light. Preserve existing stored theme choices and all four locales.
- Preserve the confirmed product interactions, content boundaries, 1px label-width Favourites underline, and existing local storage behavior.
- Keep the protected mobile runtime unchanged. Follow `app/AGENTS.md` and verify iPhone and Pixel behavior.
- Do not use MoMA assets, font files, source code, branding, or claims of affiliation.
- The local preview service remains unchanged. Final verification for this exploration must be recorded after the checks run.

## Figma redesign handoff — 2026-09-05

- Julio wants to redesign the core layouts in Figma, then provide exact visual values for implementation.
- Keep the handoff focused on representative layouts. Repeated stories, devices, themes, and interaction states are not separate design assignments.
- The curated reference set is `deliverables/daily-culture-core-screens-2026-09-05/`. It covers eight layouts with both historical visual directions for comparison.
- Daily and standalone artwork detail share a reading layout. The standalone screenshot is a supporting variant.
- Julio owns layout, typography, spacing, colors, and component decisions. The agent implements micro-interactions and derives repeated states from those decisions.
- This handoff does not approve either visual direction. Preserve confirmed product behavior until Julio changes it.

## Artsy redesign — 2026-09-19

Historical visual direction. September 20's compact monochrome direction above takes precedence where it conflicts.

- Julio requested an Artsy-inspired redesign in the working web prototype, using his Mobbin account and official design references.
- Historical reference and implementation handoff: `docs/ARTSY_DESIGN_DIRECTION.md`. Use `docs/DESIGN_SYSTEM.md` for current component decisions.
- This direction supersedes MoMA typography, colored panels, heavy rules, and square controls. It does not change the product's behavior.
- The September 19 exploration used regular sans-serif type, white and neutral surfaces, thin dividers, proportional artwork, pills, and blue interaction states. The blue states are superseded.
- Keep bundled Inter as the documented substitute for Artsy's Unica77. Do not extract font files, brand assets, or artwork from Artsy.
- Retain Daily Culture content and editorial ownership, all locales, saved preferences, contribution drafts, Daily drag/wheel/keyboard behavior, and the protected mobile runtime.
- Dark mode remains a Daily Culture adaptation. The observed Artsy references are light mode.
- Original UI files are preserved in `qa/artsy-2026-09-19/before/`. Reference captures and implementation evidence belong under `qa/artsy-2026-09-19/`.
- Read `design-qa.md` for the verified state and remaining limits. The existing local preview service remains unchanged.

## Design system starter — 2026-09-19

Historical starter scope. The current compact values and monochrome correction appear above.

- Julio requested a reusable design system accessible from a dropdown in the working prototype.
- The app-owned Prototype / Design system menu opens a full-browser library at `http://127.0.0.1:4173/?view=design-system`.
- Source and workflow handoff: `docs/DESIGN_SYSTEM.md`. Shared files: `app/src/design-system/`.
- Grow the system alongside real screens. Check existing components before creating another component or pattern.
- Daily and Search in Julio's Paper file now directly guide compact patterns. Artsy provides supporting context; Daily Culture owns content and behavior.
- The September 19 starter recorded Paper density and gutters as differences. September 20 adopts closer density and insets in compact patterns. Fonts, exact tiny text, orange navigation, and placeholder records remain deliberate exceptions.
- The starter shares semantic colors, ArtworkCard, and Toggle with the app. Remaining components and patterns are proposals for reuse, not a completed app-wide migration.
- Keep Paper and code changes explicit. There is no automatic synchronization. The browser library is an interactive catalog, not a visual component editor.
- Keep the persistent preview service and protected mobile runtime unchanged. `qa/design-system-2026-09-19/verification.md` records historical starter verification.

## Editorial voice calibration — 2026-09-20

- Working guide: `docs/editorial/VOICE_GUIDE.md`. It draws on Julio's Grace of Pascal collection and eight named favorites.
- Julio rejected both first drafts as AI-like, exaggerated, overdramatic, uninteresting, and too descriptive. See `docs/editorial/CALIBRATION_01_FLOOR_SCRAPERS.md`.
- Julio explicitly preferred round 2 B in `docs/editorial/CALIBRATION_02_FLOOR_SCRAPERS.md`, especially its first paragraph, logical and chronological explanation, and social and historical context without fluff or exaggeration. This is a preferred approach, not blanket publication approval.
- Current guide: version 0.16. Julio preferred A for both works in `docs/editorial/CALIBRATION_03_PAINTING_AND_BOOK.md`; painting A felt more cohesive and well thought out. Both book versions required clearer distinctions between fiction, real history, and author commentary. Revised book wording awaits review.
- Book entries must identify the fictional frame and distinguish story dates from publication dates. Signal moves to real history, the author's comments, or editorial interpretation. Do not present fictional events or a character's views as historical facts or the author's beliefs.
- For books, Julio values selected passages for relevant moments, strong writing, or interesting perspectives, adjusted to genre. Keep the passage, its context, and editorial commentary distinct. Preserve the source's voice and exact attribution. The Kindle study covers 27 web notebooks, 497 highlights, and two attached notes; see `docs/editorial/research-2026-09-20/README.md`. It does not cover every native-app document. Round 5 book A supplies one preferred passage/context treatment, with its final paragraph rejected; keep testing across genres.
- Round 4 feedback: `docs/editorial/CALIBRATION_04_PAINTING_BOOK_FILM.md`. Painting A preferred, with more historical/cultural interpretation requested. Both book entries rejected for content; A preferred for readability only. Film A preferred for wording but insufficient in substance. Do not treat interface tone selection or a wording preference as content approval.
- Round 5 feedback: `docs/editorial/CALIBRATION_05_PAINTING_BOOK_FILM.md`. Painting A’s opening preferred, with historical context and meaningful details to improve the ending; neither whole painting entry approved. Frankenstein A preferred except its dramatic final paragraph; B disliked. Her B preferred. Explicit feedback overrides interface selections.
- Interpretations may be opinionated but must remain restrained. Explain social practices and concrete details without a dramatic moral verdict. An accurate claim can still be too theatrical; use the last useful explanation as the ending.
- Round 6: all six entries in `docs/editorial/CALIBRATION_06_PAINTING_BOOK_FILM.md` were rejected for missing the works’ central concerns. Accurate peripheral facts and a late mention of a key feature are insufficient. Same-work revisions are required.
- Round 7: Julio explicitly preferred A for all three works in `docs/editorial/CALIBRATION_07_PAINTING_BOOK_FILM.md`. Painting A was very good, especially Christianity and memento mori; B’s viewpoint-based central reading was not accepted. Metamorphosis A was significantly improved. Truman Show A was preferred and B called bad.
- Round 8: `docs/editorial/CALIBRATION_08_SELECTED_PASSAGES.md`. Julio rejected the redundant Christof/as-quoted-by and Wyllie translation footers as clutter. Remove source-credit boilerplate from reading text; retain source, translator, edition, and film-version records separately. Natural speaker/scene context still matters. The remaining additions have no blanket approval.
- Round 9: `docs/editorial/CALIBRATION_09_PAINTING_BOOK_FILM.md`. Marat A preferred for chronological order, cohesion, and readability. Dorian Gray A more readable but incomplete; B too romantic, vague, and jargony. Both Parasite accounts fail to explain the central critique; A sounds AI-like and B is explicitly rejected. Interface A/A/B does not override this feedback.
- Across all future works, first understand the central concern, relevant human feelings/emotions, how the work develops them, and connections to society/history/culture. Write a short supported analysis note before selecting details. Generic theme labels, accurate peripheral facts, and agreement between models are insufficient.
- Latest repairs: `docs/editorial/CALIBRATION_10_BOOK_FILM_REVISIONS.md`. Preserve Marat A; clarify Dorian’s wish, moral choices, and conscience, and Parasite’s wealth/status judgment, maintained appearances, and humiliation. Proposed repairs await review. Do not generalize a fictional social critique to every South Korean person.
- Round 11 feedback, 2026-09-21: `docs/editorial/CALIBRATION_11_PAINTING_BOOK_FILM.md`. Raft A misses survival atrocities, including violence and cannibalism already present in the consulted sources. Nineteen Eighty-Four A is preferred; its story conveys political control effectively. Eternal Sunshine A is called perfect. Preserve both praised A texts; explicit film A feedback overrides the interface’s B selection.
- Guide v0.12 requires checking substantial source themes before narrowing an interpretation and comparing them against omissions in the draft. When uncertain, research museum accounts, criticism, YouTube, blogs and reader discussion; Julio especially likes Reddit and Goodreads. Verify factual claims separately and distinguish reception from creator intent. Restrained tone must not erase central cruelty or contradictions.
- Latest painting repair: `docs/editorial/CALIBRATION_12_RAFT_REVISION.md`. Connect political abandonment, violence within the stranded group, and the depicted attempt to attract rescue. Do not claim the finished canvas visibly depicts cannibalism. Revision awaits review. Round10 repairs remain unreviewed.
- Round 13 feedback: `docs/editorial/CALIBRATION_13_PAINTING_BOOK_FILM.md`. Third of May A is acceptable unchanged but weaker than other preferred iterations. Both Gatsby drafts are rejected for missing the central point; Julio did not specify the missing interpretation. Pinocchio B is preferred for capturing the central essence/message; A comes close but falls short. Spoken feedback overrides painting B/book A interface selections. Preserve the original texts.
- Round 14 approved: `docs/editorial/CALIBRATION_14_GATSBY_REVISION.md`. Julio called the Gatsby revision “Perfect” and praised its central understanding. Preserve it as an approved reference for aspiration, material success, class privilege, conduct and consequences. Earlier Gatsby A/B remain rejected.
- Julio wants self-sufficient writing and does not want indefinite A/B rounds. Guide v0.15 follows the full audit in `docs/editorial/EDITORIAL_AUDIT_2026-09-21.md`. Interpretive research must precede selecting an angle. Use substantive criticism/creator or translator discussion and reasoned public reception; compare actual final prose against the central evidence. Default to one finished entry unless a comparison is requested. Do not require routine supervision or treat preferred prose as authorization to publish.
- Round 15 feedback: `docs/editorial/research-2026-09-21/ROUND_15_FEEDBACK.md`. Potato Eaters A much preferred for readability. All Quiet A/B rejected: youth shaped by war, loss of innocence, and realistic atrocities undermining patriotic idealization were insufficiently explained; opening passage preferred as a direction. Good Will Hunting A liked through its first two paragraphs only; later quotation irrelevant, central account insufficient; B rejected as AI-like. Preserve original bodies and preferred passages. No repair has yet been approved.
- Full audit: `docs/editorial/EDITORIAL_AUDIT_2026-09-21.md`. The recurring failure is selection and emphasis, despite extensive notes and fact checks. Do not treat theme mentions, model agreement or self-certified coverage as success. Compare passage candidates for contribution to the whole entry. Familiarity does not disqualify a defining quotation. Restraint and spoiler care must not erase essential violence, human feeling or ethical consequences. Public reception supplies clues, not proof or creator intent. Guide v0.15 is a revised process, not demonstrated reliability.
- Round 16 feedback: `docs/editorial/research-2026-09-21/ROUND_16_FEEDBACK.md`. Julio preferred A for all three: Stańczyk called perfect; Animal Farm really good and approvable, with a short Boxer paragraph/quote suggested; Soul really good. Explicit Animal Farm A preference overrides interface B selection. Preserve original bodies. Guide v0.16 records the first successful complete round, not general reliability; Julio requests another round to check transfer. The Boxer addition is separate and awaits review. No publication authorization.
- Round 17: `docs/editorial/CALIBRATION_17_PAINTING_BOOK_FILM.md` compares Liberty Leading the People, Vidas Secas and I'm Still Here. All six drafts await feedback. Source records and final bodies are in `docs/editorial/research-2026-09-21/ROUND_17_*`. Book quotes are our English translations of the Portuguese original; film dialogue uses an identified translated broadcast clip. Guide remains v0.16.
- An observable visual technique does not by itself establish a central message. Ground interpretation in documented cultural/historical context, distinguish further inferences, and preserve preferred prose during additive revisions.
- Establish the work’s central concern or distinctive achievement before choosing details. Both A/B versions must explain it. For this set: Ambassadors’ skull, mortality, and anamorphosis; Kafka’s alienation and human recognition; Truman’s constructed reality, control, and agency. Check editorial significance separately from factual accuracy. Do not impose a single definitive meaning.
- Entries must help readers learn something interesting about the world through the work. Establish a book's or film's broad concern before selecting a small scene. Use verified details to support a modest opinionated argument when useful. Include plot needed for understanding; normally omit later reversals and outcomes. User-supplied historical examples still need verification.
- Prioritize informative historical explanation. Keep visual description selective. Do not require a single thesis, dramatic opening, or reflective ending. Wikipedia painting articles are an authorized additional writing reference.
- Research coverage, provenance limits, and continuation notes: `docs/editorial/research-2026-09-19/README.md`.
- Use the latest recorded feedback for future stories. Do not treat collected quotations or translations as Julio's original prose.

## Design system library framing — 2026-09-19

- Julio authorized Vercel Geist framing for the browser design-system library. This does not redesign the mobile app.
- Preserve the grouped sidebar shortcuts, navigation search, six introduction tiles, component Preview / Code tabs, and Previous / Next section actions.
- At 760px and below, use the Browse library menu and single-column introduction tiles. Preserve keyboard dismissal and focus restoration.
- Preview / Code tabs preserve mounted examples and their state. Library chrome stays separate from Daily Culture component themes.
- Keep Daily Culture's fonts, shared components, tokens, content, and behavior. Paper and code still do not synchronize automatically.
- Measured sources, deliberate differences, and source ownership are recorded in `docs/DESIGN_SYSTEM.md`.
- Historical framing checks and limits: `qa/design-system-geist-2026-09-19/verification.md`. September 20 preserves this organization while densifying the documentation. Keep the preview service and protected mobile runtime unchanged.

## Historical Today page from Paper — 2026-09-20

The September 23 Today saves and Paper action revision above supersede this section's former heart and magnifier guidance.

- Julio explicitly rejected the first implementation's typography and sizing adaptations. Extract source values from Paper; do not enlarge or substitute them by default.
- Default Today uses PP Neue Montreal TT Regular 400: title and creator 14/16, body 12/14, timestamp 10/10, all with `0.01em` tracking. Likes and categories now also use PP Neue Montreal Regular at 8/10, per Julio's latest app-wide font decision. Use the installed faces through CSS `local()`; no font files are bundled. Other machines need the same fonts or authorized webfonts for an exact match.
- Preserve Paper's 420px hero height, 4px radius, 12px image-to-metadata gap, 4px text insets, 20px actions, 14px category chips, 8px control/category gaps, 16px reading gaps, and 0.5px dividers. Light colors and icon paths come directly from Paper. Do not apply the general 44px expansion to these Today controls. The image viewer retains its own touch targets.
- Explicit Large/System reader choices and Dark mode remain supported adaptations. Live device chrome, factual story content, and app navigation remain app-owned.
- Julio requested the real Today/Daily page adopt his current Paper Daily layout: artwork, title with likes and magnifier, creator and production date, categories, divider, story, last-edited timestamp.
- Prefer two categories per story; never more than three. Use accurate form and historical/cultural context for the actual record.
- The artwork and magnifier both open a complete-image viewer with zoom, pan, reset, and download using the compact monochrome system. The magnifier is not a search action. Preserve keyboard opening and focus restoration, and suppress opening after a scroll or edition drag.
- Existing stories, editorial ownership, chronological gestures, related-story navigation, locales, preferences, and protected device runtime remain in place.
- Paper placeholder artwork/title pairings are not catalog metadata. `lastEditedAt` must be an actual editorial timestamp; show a localized unrecorded state when missing. Do not substitute the current time.
- Current typography/geometry evidence lives in `qa/today-paper-exact-2026-09-20/`. It supersedes styling adaptations in `qa/today-paper-2026-09-20/`; earlier functional evidence remains relevant. Implementation is local; Julio’s final visual review remains pending.

## First content batch — 2026-09-21

- Staged 21 English entries: three each for architecture, sculpture, painting, music, literature, theater and cinema. All await Julio’s batch approval; none is imported into the app or a database.
- Review and handoff: `docs/editorial/batches/batch-001/README.md`. Structured records: `batch-001.json`. Editable source files and research notes are in the same folder.
- Every entry has a supporting remote image, alt text, source and rights record. All 21 images were visually checked. Writing approval, image approval and app-use rights remain distinct.
- Persistent review: `http://127.0.0.1:4184/REVIEW.html`; image gallery: `/IMAGES.html`. Loopback-only service `com.juliocaggiano.daily-culture-editorial-review` runs `/usr/local/bin/node` with the batch folder’s `serve-review.mjs`.
- Rebuild review artifacts with `python3 docs/editorial/batches/batch-001/build_review.py`. Restart service with `launchctl kickstart -k gui/$(id -u)/com.juliocaggiano.daily-culture-editorial-review`. Logs: batch folder `preview-stdout.log` and `preview-stderr.log`. Keep port 4173’s app preview unchanged.
- The current prototype still reads sample pieces from `app/src/Prototype.tsx`; no connected content database was found. Approval is followed by mapping to the chosen store, locale preparation and media clearance, not an assumed automatic import.


## Literature forewords and addressed-feedback history — 2026-09-26

- Batch 006 adds ten pending literature entries, each with five short reading blocks including excerpts and three authentic cover options. Write literature as a concise, accessible foreword: central meaning, author/context, human or cultural significance. Separate fiction, narrator and author. Current guide: `docs/editorial/VOICE_GUIDE.md` v0.22.
- The review now contains 75 active works, including 13 literature. The checked browser showed 18 approved and 57 to review. Do not treat these mutable browser counts as future approval evidence.
- Seven paintings were revised from concrete feedback. `docs/editorial/batches/batch-001/feedback-revisions.json` preserves old text, exact addressed feedback, summaries and old/new body fingerprints. New matching versions retire only exact addressed notes/comments from active review; unmatched or newer feedback stays active. Show Revised/version and require fresh writing approval. Preserve image choices when image options are unchanged.
- Revision history is expandable beneath Notes. Do not erase historical feedback or clear notes just because a draft changed. Preserve the existing storage key and use explicit revision records for future migrations.
- No new import or public deployment. Frozen submissions and app catalog remain unchanged. Research: `docs/editorial/batches/batch-006/research.md`. Verification: `qa/editorial-batch-006-2026-09-26/verification.md`.
