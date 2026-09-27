# Daily Culture: Artsy redesign QA

Review date: 2026-09-19.

final result: passed

No actionable P0/P1/P2 redesign findings remain in the reviewed screens and interactions. This is an implementation review, not Julio's final visual approval.

## Source, implementation, and comparison method

- Source visual truth: `qa/artsy-2026-09-19/references/artsy-browse.png`, `artsy-search.png`, and `artsy-artwork.png`.
- Sources are the observed Artsy iOS Home, Search, and Artwork screens on Mobbin. URLs and official Palette evidence are in `docs/ARTSY_DESIGN_DIRECTION.md`.
- Implementation: `http://127.0.0.1:4173/`, served by the existing persistent local preview service.
- Browser canvas: 1400 × 1200. iPhone app screen: 393 × 852 CSS pixels; Pixel: 427 × 952 CSS pixels. Screen geometry was verified at scale 1.
- Source and iPhone comparison crops are 393 × 852 pixels at 1× density. No density resampling was required. Full browser captures were cropped using measured screen coordinates; fractional iPhone x positioning was rounded by 0.5 px.
- Full-view comparisons: `qa/artsy-2026-09-19/comparison-daily.png`, `comparison-search.png`, and `comparison-browse.png`.
- All comparisons place source and implementation together. The small UI and typography are readable at native resolution; separate magnified regions were unnecessary.
- State: light theme, default reader size, English, settled screens. Source content and marketplace destinations differ intentionally from Daily Culture's editorial product.
- Additional captures under `qa/artsy-2026-09-19/implementation/` cover collections, Favourites, Settings, dark mode, Portuguese, Italian, large text, contribution, widget, and Pixel keyboard/reading.

## Findings and comparison history

1. Initial review remained blocked while browser evidence and the production build were incomplete.
2. Screenshot review found Discover captured on the previous Daily screen and contribution captured during opening. Both were replaced with settled captures. These were evidence defects, not product defects.
3. [P1, fixed] Contribution action could fall outside the sheet's scroll region. The sheet had only a maximum height, while its child relied on a percentage height. Larger text and spacing exposed the clipping. App-owned CSS now uses a flex column, fixed header/handle, and a shrinking scroll region. Protected runtime code is unchanged.
4. Post-fix verification: the Portuguese dark contribution content measures 624 px tall with 771 px of scroll content. Scrolling reaches 147 px. The submit action then ends at y=961, above the iPhone viewport bottom at y=1026. Evidence: `implementation/contribution-dark-portuguese-bottom.png`. The action is fully visible with safe-area space below it.
5. Final source/implementation review found coherent Artsy-derived type hierarchy, neutral framing, proportional artwork, pill controls, and navigation. Independent visual review also checked Daily on both devices, Search, and dark Portuguese Settings.

## Required fidelity surfaces

| Surface | Result and intentional differences |
| --- | --- |
| Fonts and typography | Regular Inter replaces heavy MoMA typography. Type hierarchy, wrapping, metadata, and navigation were reviewed in the rendered screens. Inter is the existing licensed substitute for Unica77, not an exact font match. Daily titles use 32/38; reading uses 16/26; metadata uses 13/20. |
| Spacing and layout rhythm | 20 px mobile gutters, thin dividers, restrained section gaps, and square artwork surfaces establish the reference rhythm. Daily retains its reading layout and Discover its editorial feature. Sheet scroll containment was corrected. |
| Colors and tokens | White, black, #707070, #f7f7f7, #e7e7e7, and restrained #1023d7 states align with the documented Palette sources. Dark mode uses an original Daily Culture adaptation. Focus treatment remains visible. |
| Image quality | Existing rights-cleared/public-domain artwork retains its proportions through contain sizing. No Artsy artwork, logo, or Mobbin capture ships in the product. Discover's loaded images were checked in the browser with no missing images. |
| Copy and content | Existing stories, four locales, navigation destinations, and Julio's draft/editorial authorship remain. Marketplace pricing and sales actions are intentionally absent. Existing prototype content is not presented as newly validated research. |

## Functional and technical verification

- Final production build passed; log: `qa/artsy-2026-09-19/build.log`.
- Protected runtime integrity passed across all 28 files after the final CSS change.
- TypeScript passed as part of the production build.
- Existing Daily navigation suite: 23/23 passed; log: `qa/artsy-2026-09-19/daily-navigation.log`.
- Browser verified rightward drag to older, leftward drag toward Today and then Suggestion.
- Vertical reading and horizontal nested recommendations worked without changing Daily's selected edition or accidentally opening an item.
- Creator profile entry and return, collection entry and return, and saved-item toggle/restore worked.
- Search for Japan returned the two expected stories. iPhone and Pixel keyboard entry/dismissal worked.
- English, Portuguese, Italian, and Spanish interface choices were checked. Dark theme and large reader text were rendered. Preferences survived reload.
- Contribution draft text survived dismissal and reopening. Test text was cleared. Nothing was submitted or uploaded.
- Contribution scrolling reaches the action. The redesigned widget preview renders the full artwork and readable title.
- Existing six saved pieces and one saved collection were retained. QA preference changes were restored to English, light, and default reader size.
- Browser error/warning inspection returned no entries; evidence: `qa/artsy-2026-09-19/browser-errors.json`.
- Protected phone geometry, device picker, status bar, home indicator, and Android keyboard/navigation treatment remain intact.

## Limits and follow-up

- Browser simulations were checked; physical iPhone/Android hardware was not tested.
- This is a design-system adaptation, not a pixel-identical Artsy reproduction. Inter, original content/layouts, five existing destinations, and dark mode are explicit differences.
- Every theme, language, keyboard, and sheet combination was not exhaustively tested. System-theme and reduced-motion branches were preserved but not emulated in this review.
- The build reports an existing bundle-size advisory above 500 kB. It does not block the build or local preview.
- Sample stories and collection metadata still need Julio's editorial review. Account, notifications, widget, and submission remain prototype states.
- Original UI files and the prior QA report are retained in `qa/artsy-2026-09-19/before/`. The early `before/daily.png` and `references/mobbin-*.png` clips are not valid comparison evidence; use the named final captures above.

## Implementation checklist

- [x] Document official Palette and observed Mobbin references.
- [x] Apply the visual system to app-owned screens and components.
- [x] Preserve product behavior and protected runtime.
- [x] Fix sheet overflow and inspect post-fix evidence.
- [x] Build, verify navigation, and review iPhone/Pixel renders.
- [x] Keep the existing local preview open for Julio's review.
