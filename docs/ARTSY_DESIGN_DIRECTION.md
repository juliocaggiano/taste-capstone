# Daily Culture: Artsy-inspired redesign

| Field | Value |
|---|---|
| Authorized | 2026-09-19 |
| Request | Redesign the working prototype using Artsy's design system and app style |
| Scope | App-owned presentation in the existing local prototype |
| Status | Implementation exploration; Julio has not approved final visual details |
| Verification | Pending; record completed checks in [`../design-qa.md`](../design-qa.md) |

## Direction and evidence

This direction supersedes the MoMA-inspired visual direction where they conflict. Earlier notes remain historical evidence.
Daily Culture keeps its own identity, editorial authorship, content, navigation destinations, and product behavior.

Use two complementary references:

- Artsy's official Palette and Palette Mobile sources establish tokens and component mechanics.
- Artsy screens inspected through Julio's signed-in Mobbin account establish observed app composition and states.

The inspected public source is current, but does not establish the exact version captured by Mobbin or installed on a phone.
Mobbin's paid access is reference access. Reference captures and notes belong in `qa/artsy-2026-09-19/references/`, outside shipped assets.

## Verified official system

Source snapshots checked on 2026-09-19:

- Palette: commit `7ed4be153bf0aa43845295e6dfe3af18d8ea1b79`, dated September 15.
- Palette Mobile: commit `3c10ba49f465253c017bbf8068cd75fe0818ff78`, dated September 9; package `24.12.0`.
- Eigen: commit `8dda5bea1573899bd2b0fb600808ab398334118c`, dated September 19; consumes Palette Mobile `24.12.0`.
- Palette Mobile consumes Palette Tokens `7.0.0` and imports the v3 theme.

| Foundation | Verified value or behavior |
|---|---|
| Typography | Unica77 LL sans; web fallbacks are Helvetica Neue, Helvetica, Arial, and sans-serif |
| Small text | `xxs` 11/14, `xs` 13/20, `sm` 16/26, `sm-display` 16/20 |
| Larger text | `md` 20/32, `lg` 26/40, `lg-display` 26/32, `xl` 40/48 |
| Main colors | Black `#000000`, white `#FFFFFF`, secondary text `#707070`, brand blue `#1023D7` |
| Neutral surfaces and lines | `#C2C2C2`, `#D8D8D8`, `#E7E7E7`, `#F7F7F7` |
| Named spacing scale | 5, 10, 20, 40, 60, 120px |
| Web buttons | 30px or 50px tall, 15px or 25px corner radius, 25px horizontal padding |
| Button appearance | Black primary, outlined secondary, blue interaction states; mobile also uses pill shapes and 1px borders |
| Artwork rail | 215-unit image canvas; width between 140 and 340; proportional artwork on a pale neutral backing |
| Artwork metadata | 10-unit gap beneath image; 13/20 text; primary and secondary colors establish hierarchy |
| Mobile tab bar | 65 units plus safe area; 85 with larger font scaling; 11/14 labels below icons |
| Tab states | Black active and inactive icons; active icons become filled or heavier |

Typography pairs mean font size / line height. Web dimensions use CSS pixels; mobile dimensions use logical units.
These are verified source values, not a requirement to reproduce every Artsy component unchanged.
Current v3 uses a sans-serif foundation. Older Artsy serif or Avant-Garde examples do not define this redesign.

Official evidence:

- [Palette typography](https://github.com/artsy/palette/blob/7ed4be153bf0aa43845295e6dfe3af18d8ea1b79/packages/palette-tokens/src/typography/v3.ts)
- [Palette colors, spacing, and breakpoints](https://github.com/artsy/palette/blob/7ed4be153bf0aa43845295e6dfe3af18d8ea1b79/packages/palette-tokens/src/themes/v3.tsx)
- [Web button tokens](https://github.com/artsy/palette/blob/7ed4be153bf0aa43845295e6dfe3af18d8ea1b79/packages/palette/src/elements/Button/tokens.ts)
- [Mobile tokens and font names](https://github.com/artsy/palette-mobile/blob/3c10ba49f465253c017bbf8068cd75fe0818ff78/src/tokens.ts)
- [Artwork image sizing](https://github.com/artsy/eigen/blob/8dda5bea1573899bd2b0fb600808ab398334118c/src/app/Components/ArtworkRail/ArtworkRailCardImage.tsx)
- [Artwork metadata](https://github.com/artsy/eigen/blob/8dda5bea1573899bd2b0fb600808ab398334118c/src/app/Components/ArtworkRail/ArtworkRailCardMeta.tsx)
- [Mobile tab layout](https://github.com/artsy/eigen/blob/8dda5bea1573899bd2b0fb600808ab398334118c/src/app/Navigation/AuthenticatedRoutes/Tabs.tsx)
- [Active and inactive icons](https://github.com/artsy/eigen/blob/8dda5bea1573899bd2b0fb600808ab398334118c/src/app/Scenes/BottomTabs/BottomTabsIcon.tsx)

## Observed Mobbin references

The signed-in [Artsy iOS library](https://mobbin.com/apps/artsy-ios-bd983dfe-e88b-4f07-8b66-51dc6b2b5bf7/6a00a7db-a590-4d5a-a88f-a80f80bbb5c1/screens) showed 230 screens on 2026-09-19.
This count describes the inspected library, not every Artsy screen or platform.

| Reference | Observed treatment |
|---|---|
| [Home](https://mobbin.com/screens/0ef97ac7-5502-4c60-b7ae-a5a105b5c65e) | White foundation, regular sans-serif hierarchy, artwork rectangles, concise metadata, outlined and filled icon states |
| [Search](https://mobbin.com/screens/5b64f877-5d7b-47ce-8409-d3bda88de623) | Rounded gray search field, restrained controls, blue selected chips |
| [Artwork detail](https://mobbin.com/screens/f1455bcb-ba2d-4d19-ac29-cd494118d54b) | Artwork given visual priority, preserved proportions, clear metadata, quiet surrounding interface |

These are visual observations. Do not claim exact spacing measurements from these screens without measuring the captures.

## Daily Culture implementation handoff

- Use bundled, licensed Inter as the Unica77 substitute. Favor regular text and moderate emphasis over MoMA's heavy headings.
- Start from white, black, gray, and restrained blue. Let the existing artwork provide visual color.
- Use approximately 20px mobile gutters, 10px local gaps, and 40px section spacing as project adaptations.
- Use pill buttons, rounded neutral search, quiet 1px dividers, and blue selected controls.
- Keep artwork rectangular and proportionate. Place useful title, creator, and date information beneath it.
- Keep Daily Culture's existing destinations. Artsy's marketplace tabs do not add product requirements.
- Keep the active Favourites underline label-width and 1px thick. Preserve 13px favourite counts and 14px creator labels.
- Preserve Light, Dark, and System choices. Dark mode is an original Daily Culture adaptation, not a verified Mobbin match.
- Preserve larger reader text, visible focus, translated labels, safe areas, and sheet styling.
- Keep motion restrained and respect reduced motion. Do not alter protected gesture physics.

Palette's [software license is MIT](https://github.com/artsy/palette/blob/7ed4be153bf0aa43845295e6dfe3af18d8ea1b79/LICENSE).
This does not establish permission to redistribute separately supplied font files or artwork.
Do not download Unica77 from Artsy. Keep the existing rights-cleared and public-domain project images.
Do not ship Mobbin captures, Artsy branding, editorial copy, or reference artwork. Do not imply affiliation.

## Behavior and boundaries to preserve

- Today anchors Daily. A rightward drag reaches older editions; a leftward drag reaches newer editions, then Suggestion.
- Verify coordinates: `endX > startX` means older; `endX < startX` means newer or Suggestion.
- Preserve page order `Older editions | Yesterday | Today | Suggestion` and whole-drag destination selection.
- Short or cancelled drags stay put. Each completed drag advances at most one edition and suppresses unintended taps.
- Right Arrow and positive wheel `deltaX` reach older editions. Left Arrow and negative `deltaX` reach newer or Suggestion.
- Each wheel burst advances at most once. Preserve independent vertical reading, pinch zoom, and nested rail gestures.
- Preserve all four locales: `en`, `pt-BR`, `it`, `es`; retain local preference and favourite persistence.
- Preserve detail entry and return behavior, all Settings controls, and explicit account/notification/widget prototype states.
- Contribution retains topic, why it matters, optional sources, and optional image previews. It sends no data.
- Contribution drafts survive dismissal during the session. Do not add name, email, or a separate culture field.
- Keep Julio's editorial authorship explicit. Sample stories remain prototype content until he reviews them.

Work in app-owned presentation files, primarily `app/src/Prototype.tsx` and `app/src/prototype.css`.
Follow `app/AGENTS.md`. Preserve PhoneFrame, StatusBar, HomeIndicator, keyboard, device picker, Carousel, and MobileScroll.
Do not change protected device geometry to make app content fit.

## Review and verification

Final implementation verification passed on 2026-09-19. See [`../design-qa.md`](../design-qa.md) for captured evidence, the fixed sheet-overflow issue, checks, and remaining test limits. Julio's final visual review is still separate.

- Run the protected runtime check and production build.
- Compare meaningful screens on iPhone and Pixel, including artwork detail, Search, Favourites, and Settings.
- Verify Daily directions, vertical reading, nested rails, return paths, and tap suppression.
- Verify themes, text sizes, locales, preference persistence, and contribution draft behavior.
- Check focus, contrast, safe areas, image loading, overflow, and browser errors.
- Record remaining visual differences separately from functional failures and Julio's later visual review.

Keep the local preview at `http://127.0.0.1:4173/` using `com.juliocaggiano.daily-culture-preview`.
The service serves `app/dist/client`; build before review. This redesign does not authorize deployment.
