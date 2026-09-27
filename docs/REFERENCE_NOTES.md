# DailyArt Reference Notes

| Field | Value |
|---|---|
| Purpose | Clean-room product reference for the Daily Culture prototype |
| Review date | 2026-09-04 |
| Evidence | Current official listings, official pages, captured store screenshots, and the user-provided Settings and Daily-detail screenshots |

## Official sources

- [DailyArt on the Apple App Store](https://apps.apple.com/us/app/dailyart/id547982045)
- [DailyArt on Google Play](https://play.google.com/store/apps/details?id=com.moiseum.dailyart2)
- [DailyArt official website](https://www.getdailyart.com/)
- [DailyArt Help Center](https://support.getdailyart.com/)
- [DailyArt Terms and Conditions](https://www.getdailyart.com/terms)
- [DailyArt Magazine: the story of the app](https://www.dailyartmagazine.com/story-dailyart-mobile-app/)
- [Hologram's DailyArt redesign case study](https://www.hologramdesign.co/case-study/dailyart-app)
- [DailyArt website stylesheet](https://assets.website-files.com/63bca273a4535eaa45430017/css/dailyart.webflow.8cebae8e7.min.css)
- [Roslindale typeface specimen and licensing](https://djr.com/roslindale)
- [Newsreader source and SIL Open Font License](https://github.com/productiontype/Newsreader)

These sources can change. Recheck them before making a current factual claim.

## Public behavior observed

The current reference supports this product structure:

- Five primary tabs: DailyArt, Discover, Search, Favourites, and Settings.
- A daily detail view with a large image, date, title, metadata, creator, story, favourite control, and share action.
- Vertical reading on the daily detail view.
- Horizontal drag or swipe navigation to nearby chronological archive entries, plus a random-entry action.
- Julio reports that a rightward swipe from Today reveals a banner in the reference app. No banner capture is available yet, so its visual details remain unverified.
- The reviewed lower Daily-detail capture shows a **Check out more** heading and a horizontally clipped next card after the story.
- The reviewed Daily-detail captures show a compact creator pill. A still screenshot does not establish its tap behavior by itself.
- Discover areas for editorial themes, masterpieces, collections, and the wider archive.
- Search across the collection, with filters described in current public materials.
- Favourites grouped into Masterpieces, Artists, and Museums & Galleries. The selected label uses a content-width, one-pixel underline.
- Settings rows for Sign In, Language, Notifications, Widget, and Legal.
- Settings segmented controls for Units, Text Size, and Theme.
- Account and guest use, widgets, translations, and cross-device features described by official listings or support pages.
- Android wallpaper behavior described by the Google Play listing.

Not every behavior above appears in the captured screenshots. Official listing, release-history, or support copy supports the remaining items. Exact gesture physics, animation timing, ranking, scheduling, and data behavior remain unverified.

DailyArt does not publicly describe a spaced-repetition system in the reviewed sources. Daily Culture's six- or twelve-month resurfacing is an original product requirement.

## Settings screenshot measurements

The user-provided Settings screenshot reviewed on 2026-09-04 is 1206 × 2622 pixels. It maps to approximately 402 × 874 logical pixels at a 3× density.

- The main content uses approximately 12 logical pixels of horizontal inset.
- The Settings title begins near logical y = 63.
- Settings rows and dividers follow an approximately 54-pixel vertical rhythm.
- Dividers run from approximately x = 12 to x = 390.
- The Units, Text Size, and Theme controls occupy an approximately 200 × 31-pixel area aligned to the right.
- The visible control choices are Centimeters/Inches, Default/Large/System, and Light/Dark/System.
- The screenshot's selected values are Centimeters, Default, and System.

The advertisement and DailyArt premium promotion belong to the reference product. They are not Daily Culture requirements because monetization remains undecided.

## Provisional Daily-detail screenshot measurements

The user-provided Daily captures reviewed on 2026-09-04 have a 1206-pixel native width. Dividing by the apparent 3× density gives a 402-pixel logical reference width.

- The top capture is 1206 × 2162 pixels, or 402 × 720.67 logical pixels.
- The lower capture is 1206 × 2622 pixels, or 402 × 874 logical pixels.
- A second supplied lower capture is byte-identical to the first. It adds no independent visual state.

The top capture has SHA-256 `2175902e672945b79cadd2e5d4871aa8e21dfd932fb6addc4613395ed35137cc`. The unique lower capture has SHA-256 `b85bb09f51b86d3dc0b8ff92b5d7cddf2827a8ec7c2909906bc0307622110553`.

The measurement pass inspected original pixels, segmented visible flat fills and dividers, recorded inclusive bounds, and divided coordinates by three. These measurements remain provisional until both unique source captures are retained in `qa/reference/`.

The values below are clean-room geometry targets. They describe visible layout only. They do not claim to reveal DailyArt's underlying constants or source code. The 393-pixel column is a responsive implementation translation, not a direct 393-pixel measurement. It keeps measured logical control sizes and insets fixed while fluid panel widths reflow.

| Element | Measured geometry at 402 logical pixels | Clean-room translation at the 393-pixel QA viewport |
|---|---|---|
| Hero media panel | `x = 8`, `y = 63`, `width = 386`, radius approximately `15` | `x = 8`, `y = 63`, fluid width `377`, radius `15` |
| Story panel | Center top at `y = 448.67`, radius approximately `20` | Center top at approximately `y = 449`, radius `20` |
| Story content | Left inset `20`; divider extends to `x = 381.67` | Keep `20`-pixel side insets |
| Top circular actions | `40 × 40`; right action begins at `x = 342` | Keep `40 × 40`; right inset `20` |
| Favourite control | Approximately `77.33 × 40`; `8`-pixel gap to Share | Use `77 × 40`; gap `8` |
| Date control | Approximately `65.67 × 32` | Use minimum width `66` and height `32` |
| Creator pill | `150 × 36`; avatar approximately `28 × 28` | Keep minimum width `150`, height `36`, and avatar `28 × 28` |
| Creator-to-year spacing | Pill ends at `x = 169.67`; year ink begins at `x = 187` | Visible gap approximately `17` |
| Creator-row divider | One logical pixel; approximately `54` pixels below the pill top | One pixel; preserve the same row rhythm |
| **Check out more** entry | Copyright ink ends at `y = 345.67`; heading ink begins at `y = 374.67`, leaving approximately `29` pixels | Preserve the relative gap from the preceding content |
| **Check out more** heading | Ink begins at `x = 20.67` and spans approximately `18.67` pixels vertically; image begins approximately `20.33` pixels below heading ink | Left inset approximately `20`; preserve the relative vertical gap |
| Recommendation media | `264 × 177`, aspect ratio approximately `1.49:1`, radius approximately `6.3` | Keep `264 × 177`; use radius approximately `7` |
| Recommendation rail | `12`-pixel gap; second card begins at `x = 296`; content clips near the `20`-pixel right inset | Gap approximately `12`; keep the next card visibly clipped |
| Recommendation copy | Title uses two visible lines and begins approximately `14.33` pixels below the image; byline begins approximately `42.67` pixels below the title ink | Preserve the line count and relative gaps; typeface substitution can change exact ink bounds |

Flat fills and dividers were measured directly to within one native pixel, or about 0.33 logical pixels. Rounded, translucent, and glyph edges remain approximate because of antialiasing.

At other supported widths, preserve the measured logical control sizes, hierarchy, insets, aspect ratios, and visible next-card cue. Let fluid panel widths reflow. Do not force 402-pixel absolute page coordinates onto a different viewport.

The capture does not show the fully scrolled last-card position. Its final reachability and trailing inset remain implementation acceptance criteria, not measured reference facts.

The supplied captures do not show the destination profile page. Its internal layout remains an original Daily Culture design until direct reference evidence supports a narrower comparison.

## Typography finding

DailyArt's official website stylesheet declares **Roslindale Display Condensed Medium** at weight 500 and a Light Italic cut at weight 300. The public app screenshots share its condensed proportions, wedge serifs, tight spacing, and rounded terminals.

This is a strong visual and brand-system inference. It is not confirmation from DailyArt's private app bundle.

Roslindale is commercially licensed. Daily Culture must not copy, download, redistribute, or hotlink DailyArt's hosted font files. The clean-room prototype uses **Newsreader**, which is available under the SIL Open Font License 1.1, as an intentionally licensed substitute. Daily Culture does not claim that Newsreader is identical to Roslindale.

## Prototype interaction decisions from 2026-09-04

- Dragging or swiping horizontally on Daily moves one chronological entry at a time and snaps to a complete day.
- The prototype supports four fully localized reading options: English, Português, Italiano, and Español.
- A language change updates visible navigation, Settings, Search, and sample story content. It does not only change the selected-language label.
- Notifications and Widget are functional web simulations. The browser prototype does not register native push notifications or install an operating-system widget.
- The Favourites selection indicator is a one-pixel underline sized to the selected label, not a fixed-width bar.
- Each completed Daily story can expose editor-approved continuations through a **Check out more** horizontal rail.
- Horizontal intent inside the recommendation rail moves only that rail. Vertical intent continues story reading.
- Tapping a recommendation opens standalone story detail. Back restores the originating Daily date at the top, without restoring the previous vertical or rail offset.
- The attribution pill opens its linked creator or cultural-context profile. Closing it returns to the originating story state.
- Today sits between the Daily Culture contribution invitation and the chronological archive. Leftward finger movement reveals the past; rightward finger movement from Today reveals contribution.
- The contribution banner and form are original Daily Culture product decisions. They do not claim visual parity with the unprovided reference banner.
- The Daily favourite count uses 13px text. The creator name inside the measured 150 × 36 pill uses 14px text.

## Screenshot set

The local reference set contains twelve store-marketing screenshots:

- `../references/dailyart/app-store/01-today.webp` through `06-favourites.webp`
- `../references/dailyart/google-play/01-overview.webp` through `06-search.webp`

Some filenames describe their download order, not the screen shown. In particular, the current App Store image named `05-search.webp` shows a city guide. The current Google Play image named `06-search.webp` shows favourites.

The screenshots are reference-only. Do not embed, redistribute, or ship them as Daily Culture assets. Marketing frames can distort scale, perspective, or device chrome. Measure the app surface inside each frame.

## Clean-room boundary

Daily Culture is an independent implementation of publicly observable interaction patterns.

The project does not extract or copy:

- DailyArt source code or design files
- Private APIs, databases, or service behavior
- DailyArt branding, logos, editorial text, or product name
- DailyArt artwork files or other restricted media

The prototype may reproduce generic patterns such as daily delivery, bottom navigation, search, favourites, editorial collections, recommendation rails, and attribution profiles. It uses Daily Culture branding, original interface code, and public-domain or CC0 sample media.

Screenshot measurements apply only to generic geometry and interaction structure. They do not authorize reuse of reference copy, media, branding, icon artwork, font files, or recommendation data.

Before a public release, replace any temporary reference styling with a distinct Daily Culture visual system. Complete a rights review for every shipped asset and story.
