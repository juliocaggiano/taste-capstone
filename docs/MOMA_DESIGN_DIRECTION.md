# Daily Culture: MoMA-inspired design exploration

| Field | Value |
|---|---|
| Date | 2026-09-05 |
| Status | Current exploration; final visual details await Julio's review |
| Request | Reimagine Daily Culture through a different design system, using MoMA's website and wider design choices as inspiration |
| Scope | App-owned visual design inside the existing mobile runtime |
| Verification | Pending final browser and runtime checks |

## Direction and decision status

Julio authorized a new visual exploration inspired by MoMA. He has not approved the final palette, typography, or component details.

The direction treats Daily Culture as a small, changing exhibition. Strong typography introduces each piece. Rectangular image and color panels organize the reading experience. Clear rules separate editorial sections.

This exploration supersedes the former DailyArt-derived typography, dark-first presentation, rounded treatments, and measured visual geometry where they conflict. The earlier reference notes remain a historical record.

Product behavior, editorial ownership, content rights, and protected mobile runtime requirements remain active.

## Observed public reference

The MoMA homepage and collection page were directly reviewed on 2026-09-05. These observations describe the inspected pages and viewport. They are not a complete or official MoMA design system.

| Observation | Evidence and scope |
|---|---|
| Strong typographic hierarchy | At the inspected 1280px desktop viewport, computed display typography used MoMA Sans with weight 900. The hero heading measured 60px with 60px line height. Section headings measured 40px with 40px line height. |
| Large institutional wordmark | The homepage gave the wordmark substantial visual prominence. |
| Firm page structure | The reviewed homepage used 48px side margins and 3px horizontal rules. |
| Direct navigation | Navigation used plain text with little decorative framing. |
| Rectangular media | Square image treatments and sharp panel edges supported the exhibition layout. |
| Rectilinear search | The collection page used an underlined, rectangular search treatment. |

Sources: [MoMA homepage](https://www.moma.org/) and [MoMA collection](https://www.moma.org/collection/).

Do not treat these desktop measurements as mobile specifications. Responsive behavior beyond the inspected states still needs direct evidence.

## Chosen Daily Culture adaptation

The following choices are our adaptation for this exploration. They are not measurements or official tokens from MoMA.

### Typography

- Use the licensed, bundled Inter family.
- Use weights 800 and 900 for prominent headings and the Daily Culture wordmark.
- Use 17px reading copy as the default, with the existing larger and system text preferences.
- Use strong hierarchy and compact heading line spacing without clipping translated titles.
- Retain clear metadata, source notes, and visible editorial authorship.

Inter provides an available licensed sans-serif foundation. MoMA Sans is not imported, copied, or presented as available for this project.

### Color

| Role | Exploration value | Intended use |
|---|---|---|
| Base | White and near-black | Reading surfaces, navigation, body text, and rules |
| Orange | `#ff6334` | Prominent editorial panels and accents |
| Sky blue | `#b9dceb` | Secondary exhibition panels |
| Yellow | `#ffe05a` | Highlights and collection panels |
| Lavender | `#d5c7ef` | Alternate editorial panels |

Use dark text on the bright panels. Verify text and control contrast in the final rendered states.

Fresh browser preferences begin in Light. Existing stored theme choices remain respected. Light, Dark, and System controls remain available.

### Layout and components

- Use approximately 20px in-frame side margins for the new editorial layout.
- Adapt to the calibrated iPhone and Pixel screen widths. Do not resize the protected device chrome.
- Use square corners, rectangular exhibition blocks, title panels, and more prominent section headings.
- Give Daily Culture its own wordmark treatment. Keep the name distinct from MoMA.
- Use gallery-like Favourites with clear image, title, creator, and date hierarchy.
- Apply the same visual language to Daily, Discover, Search, Favourites, Settings, details, and sheets.
- Keep search and form fields visually direct, with clear focus and error states.
- Preserve the active Favourites underline's label-width behavior and 1px stroke.
- Keep the documented 13px favourite count and 14px creator label where those controls remain.

The former DailyArt geometry does not constrain the new layout. Existing controls must remain reachable, readable, and stable during use.

### Motion

Use short transitions, generally 140–220ms, for app-owned visual feedback. Keep motion functional and restrained.

Preserve the protected Carousel and MobileScroll gesture behavior. Their physics are outside this visual redesign.

Reduced-motion preferences remove nonessential travel and scale effects. They must not change navigation destinations or selected state.

## Behavior that must remain

- Today anchors Daily. A physical rightward pointer or finger drag reaches older editions one at a time.
- A physical leftward drag moves toward Today, then reaches the contribution invitation.
- Julio's latest request inverts the earlier directions. Verify actual movement: `endX < startX` reaches newer editions or Suggestion from Today; `endX > startX` reaches older editions. Preserve protected natural dragging with rendered page order `Older editions | Yesterday | Today | Suggestion`.
- Left Arrow and negative horizontal wheel `deltaX` reach newer editions, then Suggestion. Right Arrow and positive `deltaX` reach older editions. Each scrolling burst advances at most one edition, including its momentum tail. Preserve vertical reading, pinch zoom, and native scrolling in nested recommendation rails.
- Each Daily entry supports vertical reading. Nested recommendation rails own their horizontal gestures.
- Daily snapping uses the whole drag's direction. Release momentum cannot reverse the chosen destination. Short and cancelled gestures stay on the current edition.
- Completed drags never trigger card or control taps.
- Story, collection, and creator details keep their existing entry and return behavior.
- Favourites and preferences persist in local browser storage.
- All four locales remain available: `en`, `pt-BR`, `it`, and `es`.
- Language changes translate visible interface text and prototype stories.
- Settings preserves Sign In, Notifications, Widget, Units, Text Size, Theme, and the other existing controls.
- Account sync, notification delivery, widget installation, and sharing remain their existing prototype states.
- Contribution intake keeps topic, why it matters, optional sources or links, and optional local image previews.
- Contribution does not request name, email, or a separate culture, place, or community field.
- Dismissing contribution preserves its unfinished draft and image previews during the current app session.
- Contribution success does not claim transmission or review.

## Implementation boundaries

Build the visual exploration in `app/src/Prototype.tsx` and `app/src/prototype.css`. Follow `app/AGENTS.md` for protected runtime boundaries.

Keep PhoneFrame, live StatusBar, HomeIndicator, keyboard, device picker, and gesture primitives intact. App-owned CSS may adjust contrast behind the unchanged device chrome.

Theme tokens must also reach phone-scoped sheets. Preserve text-size choices, safe-area spacing, visible keyboard controls, and focus indicators.

Use existing rights-cleared project media. Do not import MoMA assets, typeface files, source code, editorial writing, or branding. Do not imply a MoMA affiliation.

Keep Julio's editorial ownership explicit. Sample stories remain prototype content until he reviews them.

## Review and verification

Verification completed on 2026-09-05 is recorded in `../qa/moma/VERIFICATION.md`. The broader regression checklist remains:

- Run the protected runtime check and production build.
- Verify all five main destinations and detail return behavior.
- Check Daily gestures, nested rails, and tap suppression.
- Check favourites and theme persistence after reload.
- Review Light, Dark, larger text, and translated screens on iPhone and Pixel.
- Check contribution validation, keyboard layout, draft persistence, and removable image previews.
- Inspect screenshots for clipping, contrast, safe-area spacing, and coherent component styling.
- Check browser console errors and content image loading.

Keep the current local preview service and URL:

- Service: `com.juliocaggiano.daily-culture-preview`
- Preview: `http://127.0.0.1:4173/`
- Build output: `app/dist/client`
- Logs and restart instructions: root `AGENTS.md`

This exploration does not authorize deployment. Record final verification separately from Julio's later visual review.
