// Original Taste (V1.2) compositions. No third-party artwork or brand assets.
export const systemAssets = [
  {
    id: "gallery-mark",
    name: "Gallery mark",
    description: "A small collection of frames. For empty galleries and collection covers.",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180" fill="none"><title>Taste (V1.2) gallery mark</title><rect width="240" height="180" fill="white"/><g stroke="#111111" stroke-width="2"><rect x="38" y="26" width="70" height="88"/><rect x="120" y="26" width="82" height="58"/><rect x="38" y="126" width="70" height="28"/><rect x="120" y="96" width="82" height="58"/></g><circle cx="73" cy="70" r="19" fill="#111111"/><path d="M131 72L153 45L168 61L180 50L191 72H131Z" fill="#111111"/><path d="M140 141V110H162L183 141H140Z" fill="#111111"/></svg>',
  },
  {
    id: "reading-mark",
    name: "Reading mark",
    description: "An open page. For reading lists and editorial introductions.",
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="180" viewBox="0 0 240 180" fill="none"><title>Taste (V1.2) reading mark</title><rect width="240" height="180" fill="white"/><g stroke="#111111" stroke-width="2"><path d="M120 51C98 31 69 31 40 42V139C68 128 97 128 120 148C143 128 172 128 200 139V42C171 31 142 31 120 51Z"/><path d="M120 51V148M55 62C73 57 93 60 105 68M55 79C73 74 93 77 105 85M55 96C73 91 93 94 105 102M135 68C147 60 167 57 185 62M135 85C147 77 167 74 185 79M135 102C147 94 167 91 185 96"/></g></svg>',
  },
] as const;

export function downloadFile(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  // Keep download links in the active dialog; the rest of the page is inert.
  anchor.hidden = true;
  (document.querySelector("dialog[open]") ?? document.body).appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const newComponentBrief = `# Taste (V1.2) component proposal

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
`;
