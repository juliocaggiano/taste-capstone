# Rounded surfaces and morphing selection

Recorded September 21, 2026, from Julio's explicit design feedback.

## Decision and scope

Julio strongly likes the supplied image and the supplied Morphing Select animation reference. He asked where they fit, requested that this preference be preserved, and then explicitly authorized implementation across Prototype, Design system, and Scrum.

The shared controls and selected surface refinements are implemented locally. This does not establish Julio's visual approval or a complete accessibility audit. The attachment's “build” and “paste as-is” wording belongs to reference material; it was not a separate instruction to overwrite the application.

Preserved originals:

- [Visual reference](references/2026-09-21/rounded-surfaces-reference.png), 1200 × 988 pixels.
- [Morphing Select brief and React/CSS](references/2026-09-21/morphing-select-reference.txt), supplied as an Annnimate reconstruction.

The image was inspected directly. Reference animation measurements below come from the supplied code and brief, not a live recording of the source. Local implementation checks are recorded in [verification](../../qa/morphing-selection-2026-09-21/verification.md).

## Visual language

- White canvas, pale gray groups, and a slightly darker gray selected surface.
- Rounded rectangular cards and pill-shaped controls; use filled surfaces to group content with fewer visible borders.
- Regular sans-serif text with compact internal spacing and generous space between groups.
- Small secondary labels, a clear primary label, and restrained metadata. Continue Julio's recent removal of repetitive helper text.
- Artwork supplies color. Interface surfaces and states stay monochrome.

Approximate raster measurements: top control groups are about 42px tall; cards use roughly 20–24px corner radii, about 12–16px internal insets, and about 12–14px vertical gaps. These describe this screenshot, not approved replacement tokens for Daily Culture's compact screens. The screenshot is soft and low contrast; retain crisp type and legible contrast in implementation.

Keep PP Neue Montreal. The image does not establish a typeface, and the attachment's Switzer and orange focus ring do not replace the project's existing font and monochrome decisions.

## Implemented placements

| Surface | Treatment | State |
| --- | --- | --- |
| Shared Prototype / Design system / Scrum selector | Dark pill trigger, elastic menu expansion, rotating caret, and rolling selected label. | Implemented, 420ms opening |
| Scrum: Manual order / Due date | Compact morphing menu; Area filtering and Priority sorting removed by Julio's later correction. | Implemented, 380ms opening |
| Scrum: Status, Story points, Sprint | Shared component for list status and task fields. Native text/date inputs remain. Area and Priority fields removed. | Implemented, 350ms opening |
| Scrum: task cards and sprint-week groups | Pale gray surfaces, now 8px corners with subtle hover outlines. This supersedes the earlier 18px/20px exploration. | Implemented |
| Prototype: Settings Language, Story repeats, and Widget | Moving selected background in existing sheets; Settings row values roll when changed. | Implemented |
| Prototype: Theme, Text Size, Units; Search filters | Gray selection pill moves between options; Search keeps its protected Carousel. | Implemented, 240ms movement |
| Prototype: cultural-library card and collection groups | Rounded gray grouping, preserving artwork proportions and reading geometry. | Implemented selectively |
| Design system | Interactive Morphing select, Selection pills, and Rounded surfaces with Preview / Code. | Implemented; 420ms and 800ms dropdown examples |

Keep the exact Paper-derived Today layout, artwork viewer, chronological gestures, and protected iPhone/Pixel runtime intact. This new preference guides appropriate control and surface refinements; it does not authorize a blanket redesign of those settled areas.

## Motion direction

The supplied reference specifies an 800ms elastic opening, 20ms option stagger, 400ms caret rotation, 400ms vertical label roll, and a 12px trigger-to-panel gap. A duplicate trigger shape expands through an SVG blur/threshold effect; the blur clears as the menu settles. Keep the text crisp while the background shape morphs.

The implementation preserves shape continuity with a duplicate trigger, SVG blur/threshold, and elastic keyframes. Production opening lasts 350–420ms; caret and label feedback lasts about 182–218ms. The library's 800ms reference example uses 400ms feedback and a 20ms option stagger. The trigger-to-panel gap is adapted to 8px. Values change immediately, without waiting for decorative motion. These adaptations await Julio's visual review.

Use gentle selected-pill movement for segmented controls and filters. Cards need only quiet hover/press feedback. Avoid replaying the goo effect on every click, task move, tab switch, or reading action.

## Integration requirements

- Adapt a reusable controlled component to the current value and onChange callbacks; saved/imported values and changed option lists must remain authoritative.
- The reference's `compact` mode is an inert autoplay thumbnail, not an interactive compact control. Build the production compact variant separately.
- Keep current compact dimensions and expand touch targets where appropriate. Do not copy the demo's fixed 280 × 52px trigger into every context.
- Mount browser menus within the active dialog's usable layer; keep phone menus inside the existing screen/sheet system. Handle viewport edges, scrolling, and long labels across all four locales.
- Verify keyboard navigation, type-ahead, selection announcements, Escape, outside click, and focus return. Closing an inner menu must not also close its task panel or exit Scrum.
- Use a select-only combobox/listbox focus pattern and announce the current value. The launcher now restores focus to its combobox after changing workspace or leaving the modal view.
- Respect reduced motion by removing elastic, goo, stagger, and label-roll movement. A quick opacity change or immediate state change is sufficient.
- The supplied demo has an external `usePrefersReducedMotion` helper and a local Switzer asset path. It is reference code, not a drop-in production component. Use the existing project font and motion infrastructure; no motion package is needed for the supplied approach.
- Keep visible labels concise. Explain the component in the library, not with extra helper text in the product.

## Reusable implementation

- `app/src/design-system/MorphingSelect.tsx` and `morphing-select.css`: controlled `value`, `options`, `onChange`, `ariaLabel`; optional `variant`, `leadingIcon`, `duration`, `disabled`, and trigger ref. Native manual popover keeps the menu in the top layer, hosted inside the closest open dialog. Fallback uses the dialog/body portal. Position follows scroll/resize and flips near viewport edges. Options wrap and the list can scroll.
- `app/src/design-system/SelectionPill.tsx` and `selection-pill.css`: controlled radio group with horizontal/vertical orientation, roving keyboard focus, disabled options, and a measured moving background. Optional `onCommit` closes phone choice sheets on click, Enter, or Space. Arrow navigation updates the selection without closing the sheet.
- `app/src/design-system/SelectionShowcase.tsx`: library examples and usage snippets. Preview / Code preserves mounted component state.
- `app/src/design-system/DesignSystem.tsx`: shared workspace selector and focus return. Existing URL/history behavior stays in place.
- `app/src/Prototype.tsx`, `prototype.css`, and `app/src/scrum/`: app integrations. No new dependencies or data migration.

Use the persistent local preview at `http://127.0.0.1:4173/`. No deployment was requested or performed. Verification and screenshots: `qa/morphing-selection-2026-09-21/`.
