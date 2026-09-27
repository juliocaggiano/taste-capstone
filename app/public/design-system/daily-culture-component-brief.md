# Taste (V1.2) component proposal

Status: proposal. Owner: Julio Caggiano.

## Purpose
What user need does this component serve? Where will it appear?

## Reuse check
Review app/src/design-system/components.tsx and patterns.tsx first.
Why can an existing component or variant not cover the need?

## Design
Reference the relevant Daily or Search frame in Paper.
List semantic tokens, anatomy, sizes, and responsive behavior.
Use PP Neue Montreal throughout the app and library, through the shared font token.
The local prototype resolves installed faces through design-system/fonts.css; no font files are bundled.
Exact rendering elsewhere requires matching installed fonts or authorized webfonts.
Keep the interface monochrome; color belongs to artwork.
Use 4–8px gaps for related elements, compact controls, and close metadata.
Follow the current compact type and spacing tokens; keep touch targets usable.

## States
Default, focus, pressed, selected, disabled, loading, empty, error as applicable.
Define keyboard behavior, accessible names, touch targets, and long translated labels.

## Content and assets
Identify content source and rights. Mark draft stories explicitly.
Never use reference placeholder text or images as verified catalog records.

## Implementation and review
Add the smallest reusable export to components.tsx or a composed pattern to patterns.tsx.
Add a working example to DesignSystem.tsx.
Keep mobile runtime files unchanged. Use its keyboard-aware fields and Carousel in phone flows.
Check runtime integrity, build, and relevant behavior. Review iPhone and Pixel.
Record deliberate source differences and obtain Julio's visual review.
