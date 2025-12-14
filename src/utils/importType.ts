import { SvgType, VueSvgPluginOptions } from '@/types';

const IMPORT_TYPE_REGEX = /\?([^&=?#]+)/;

/**
 * Extracts the first query parameter from a file name query string.
 * @example `file.ts?raw` => `raw`
 */
export function parseImportType(path?: string | null, defaultValue: SvgType = 'url') {
  return (path?.match(IMPORT_TYPE_REGEX)?.[1] as SvgType | undefined | null) || defaultValue;
}

/**
 * Gets the importType from path, using alias mapping and defaults
 */
export function getImportType(path?: string | null, options?: Pick<VueSvgPluginOptions, 'aliasMap' | 'defaultType'>): SvgType {
  const importType = parseImportType(path, options?.defaultType);

  return options?.aliasMap?.[importType] || importType;
}
