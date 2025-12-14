import transform from '@/core';
import { safePath } from '@/utils/safePath';
import { getImportType } from '@/utils/importType';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { VueSvgPluginOptions } from '@/types';
import type { Plugin } from 'vite';

export type SvgPluginOptions = VueSvgPluginOptions & { regex?: RegExp }

const DEFAULT_REGEX = /\.svg(\?(url|raw|component))?$/i;

/**
 * Vite plugin for transforming SVG files
 * @desc Default regex = `/\.svg(\?(url|raw|component))?$/i`
 */
export default function vitePlugin(options?: SvgPluginOptions) {
  let isProd = false;
  const regex = options?.regex || DEFAULT_REGEX;

  const plugin: Plugin = {
    name: 'vue-svg-plugin',
    enforce: 'pre',

    configResolved(config) {
      isProd = config.isProduction;
    },

    async load(path: string) {
      // Skip virtual modules
      if (path.startsWith('virtual:') || path.startsWith('\0') || !regex.test(path)) {
        return;
      }

      const importType = getImportType(path, options);

      if (importType === 'url') {
        return;
      }

      try {
        const result = transform({
          path,
          importType,
          code: await this.fs.readFile(safePath(path, false), { encoding: 'utf8' }),
          compileOptions: { ...options?.compileOptions, isProd },
          transform: options?.transform,
        });

        if (result?.tips?.length) {
          this.warn(result.tips.join('\n'));
        }

        return result?.code;
      } catch (error) {
        this.warn(getErrorMessage(error));

        return null;
      }
    }
  };

  return plugin;
}
