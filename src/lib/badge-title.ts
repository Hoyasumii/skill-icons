export const MAX_TITLE_LENGTH = 40;

/** The badge title as the alt text: trimmed and capped; empty means "use the default". */
export function cleanTitle(raw: string | null | undefined): string | undefined {
  return raw?.trim().slice(0, MAX_TITLE_LENGTH).trim() || undefined;
}
