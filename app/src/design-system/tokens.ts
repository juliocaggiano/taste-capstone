/** Editable source. The build generates tokens.css and public design-system exports. */
const fontFamilies = ["PP Neue Montreal", "PP Neue Montreal TT", "system-ui", "sans-serif"];
export const fontCss = fontFamilies.map((name) => name.includes(" ") ? JSON.stringify(name) : name).join(", ");

/** Three UI grays, plus the white canvas. Semantic roles reuse these values. */
export const neutralPalette = {
  dark: "#252525",
  medium: "#6e6e6e",
  light: "#f2f2f2",
  canvas: "#ffffff",
} as const;
export const neutralColors = [
  { name: "Dark gray", key: "dark", variable: "--dc-gray-dark", value: neutralPalette.dark, description: "Primary text and actions" },
  { name: "Medium gray", key: "medium", variable: "--dc-gray-medium", value: neutralPalette.medium, description: "Secondary text and category labels" },
  { name: "Light gray", key: "light", variable: "--dc-gray-light", value: neutralPalette.light, description: "Quiet surfaces and dividers" },
  { name: "White canvas", key: "canvas", variable: "--dc-white", value: neutralPalette.canvas, description: "Page and reading canvas" },
] as const;

/** Five dark-mode tones measured and adapted from Julio's September 23 reference. */
export const darkPalette = {
  background: "#171717",
  surface: "#262626",
  raised: "#333333",
  muted: "#a3a3a3",
  text: "#f2f2f2",
} as const;
export const darkColors = [
  { name: "Charcoal canvas", key: "background", variable: "--dc-background", value: darkPalette.background },
  { name: "Surface", key: "surface", variable: "--dc-surface", value: darkPalette.surface },
  { name: "Raised surface", key: "raised", variable: "--dc-surface-raised", value: darkPalette.raised },
  { name: "Muted text", key: "muted", variable: "--dc-muted", value: darkPalette.muted },
  { name: "Soft white", key: "text", variable: "--dc-text", value: darkPalette.text },
] as const;

const semanticColor = (name: string, key: string, light: keyof typeof neutralPalette, dark: keyof typeof darkPalette, description: string) => ({
  name, key, variable: `--dc-${key}`, value: neutralPalette[light], darkValue: darkPalette[dark], lightPrimitive: light, darkPrimitive: dark, description,
});
export const colorTokens = [
  semanticColor("Background", "background", "canvas", "background", "Page and reading canvas"),
  semanticColor("Surface", "surface", "light", "surface", "Quiet containers and search fields"),
  semanticColor("Text", "text", "dark", "text", "Primary text and primary actions"),
  semanticColor("Muted", "muted", "medium", "muted", "Creator names and secondary information"),
  semanticColor("Divider", "divider", "light", "raised", "Hairlines and quiet boundaries"),
  semanticColor("Focus", "focus", "dark", "text", "Monochrome focus rings; distinguish states with outlines, labels, and icons"),
  semanticColor("Selected surface", "selected-surface", "canvas", "background", "Selected capsule and menu option"),
] as const;

const compactSpacing = [2, 4, 6, 8, 12, 16, 24, 32];
// Keep existing CSS names available while new screens use the compact scale.
export const spacingTokens = [2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 60].map((pixels) => ({
  name: `${pixels}`,
  variable: `--dc-space-${pixels}`,
  value: `${pixels}px`,
  pixels,
  compact: compactSpacing.includes(pixels),
}));
export const compactSpacingTokens = spacingTokens.filter((token) => token.compact);

export const typeTokens = [
  { name: "Caption", key: "caption", size: 10, lineHeight: 12, weight: 400, letterSpacing: 0, description: "Compact metadata, following the Paper gallery scale" },
  { name: "Label", key: "label", size: 12, lineHeight: 16, weight: 400, letterSpacing: 0, description: "Compact controls and secondary labels" },
  { name: "Body", key: "body", size: 14, lineHeight: 20, weight: 400, letterSpacing: 0, description: "General reading text. The live Today screen uses compact 14/16 reading text." },
  { name: "Section", key: "section", size: 16, lineHeight: 20, weight: 400, letterSpacing: 0, description: "Compact collection and section headings" },
  { name: "Title", key: "title", size: 20, lineHeight: 24, weight: 400, letterSpacing: 0, description: "Compact page headings" },
  { name: "Display", key: "display", size: 32, lineHeight: 40, weight: 400, letterSpacing: 0, description: "Editorial display type used sparingly" },
].map((token) => ({ ...token, variable: `--dc-type-${token.key}-size`, value: `${token.size}px / ${token.lineHeight}px` }));

const dimension = (value: number) => ({ value, unit: "px" as const });

// DTCG 2025.10 color objects use normalized sRGB components and an optional hex fallback.
const color = (hex: string) => ({
  colorSpace: "srgb" as const,
  components: [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255),
  alpha: 1,
  hex,
});

const colorMode = (mode: "light" | "dark") => ({
  ...Object.fromEntries(colorTokens.map((token) => [token.key, {
    $type: "color",
    $value: mode === "dark" ? color(token.darkValue) : `{color.neutral.${token.lightPrimitive}}`,
    $description: token.description,
  }])),
  "surface-raised": { $type: "color", $value: mode === "dark" ? color(darkPalette.raised) : `{color.${mode}.background}` },
  chip: { $type: "color", $value: `{color.${mode}.surface}` },
  faint: { $type: "color", $value: `{color.${mode}.muted}` },
  nav: { $type: "color", $value: `{color.${mode}.${mode === "dark" ? "surface" : "background"}}` },
  accent: { $type: "color", $value: `{color.${mode}.text}` },
  success: { $type: "color", $value: `{color.${mode}.text}`, $description: "Use a success label and icon; do not rely on color to communicate status." },
  error: { $type: "color", $value: `{color.${mode}.text}`, $description: "Use an error label and icon; do not rely on color to communicate status." },
});

/** JSON-compatible draft token document; both themes have explicit, resolvable values. */
export const tokenDocument = {
  $description: "Taste (V1.2) foundations, draft 0.5. Light mode keeps three gray primitives plus a white canvas. Dark mode uses five neutral tones from Julio's September 23 reference: charcoal canvas, surface, raised surface, muted text, and soft white. Translucency and shadows reuse those tones. Compact density follows Paper Daily/Search references. PP Neue Montreal is the shared app and library font. CSS local() uses installed faces; font files are not bundled. Exact rendering elsewhere requires matching installed fonts or authorized webfonts. General reading uses 14/20; live Today uses 14/16. General compact controls expand to 44px on coarse pointers; live Today preserves its exact controls. Artwork retains its own colors.",
  color: {
    neutral: Object.fromEntries(neutralColors.map((token) => [token.key, { $type: "color", $value: color(token.value), $description: token.description }])),
    light: colorMode("light"),
    dark: colorMode("dark"),
  },
  space: Object.fromEntries(spacingTokens.map((token) => [token.name, {
    $type: "dimension",
    $value: dimension(token.pixels),
  }])),
  font: {
    family: { $type: "fontFamily", $value: fontFamilies, $description: "Use with design-system/fonts.css for local Regular, Medium, Bold, Light, and italic faces. No font files are included." },
    regular: { $type: "fontWeight", $value: 400 },
  },
  typography: Object.fromEntries(typeTokens.map((token) => [token.key, {
    $type: "typography",
    $value: {
      fontFamily: "{font.family}",
      fontSize: dimension(token.size),
      fontWeight: "{font.regular}",
      letterSpacing: dimension(token.letterSpacing),
      lineHeight: token.lineHeight / token.size,
    },
    $description: token.description,
  }])),
  border: {
    width: { $type: "dimension", $value: dimension(1) },
  },
  radius: {
    artwork: { $type: "dimension", $value: dimension(4), $description: "Draft artwork radius observed in Julio's Paper references; not a global retrofit." },
    pill: { $type: "dimension", $value: dimension(999) },
  },
};
