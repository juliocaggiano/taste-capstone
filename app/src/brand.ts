/** Current public name. Legacy keys and source paths stay unchanged. */
export const APP_NAME = "Taste";
export const APP_VERSION = "V1.2";
export const APP_LABEL = `${APP_NAME} (${APP_VERSION})`;
export const APP_FILE_PREFIX = "taste-v1.2";

/** Present legacy prose under the current name without rewriting saved records. */
export function displayBrand(text: string): string {
  return text.replace(/\bDaily Culture\b/g, APP_LABEL);
}
