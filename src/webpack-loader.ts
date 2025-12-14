import transform from '@/core';
import { getImportType } from '@/utils/importType';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { VueSvgPluginOptions } from '@/types';
import type { LoaderContext } from 'webpack';

export type SvgLoaderOptions = VueSvgPluginOptions

/**
 * Webpack/Rspack loader for transforming SVG files
 */
export default function webpackLoader(
  this: LoaderContext<SvgLoaderOptions>,
  code: string
) {
  const options = this.getOptions();
  this.cacheable(true);

  const importType = getImportType(this.resourceQuery, options);

  if (importType === 'url') {
    this.callback(null, code);
    return;
  }

  try {
    const result = transform({
      code,
      importType,
      path: this.resourcePath,
      compileOptions: { ...options?.compileOptions, isProd: this.mode === 'production' },
      transform: options?.transform,
    });

    if (result?.tips?.length) {
      this.emitWarning(new Error(result.tips.join('\n')));
    }

    this.callback(null, result?.code);
  } catch (error) {
    this.emitWarning(new Error(getErrorMessage(error)));
    this.callback(null, code);

    return;
  }
}
