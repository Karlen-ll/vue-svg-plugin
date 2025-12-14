const QUERY_REGEX = /\?[^#]*/;
const PATH_CLEANUP = /[?#].*$/;

/**
 * Extracts safe file path by removing query parameters
 * @example `file.ts?query#hash` => `file.ts#hash`
 */
export function safePath(path?: string | null, keepHash = true): string {
  return path?.replace(keepHash ? QUERY_REGEX : PATH_CLEANUP, '') || '';
}
