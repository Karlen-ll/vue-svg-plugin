import { compileTemplate } from 'vue/compiler-sfc';
import { safePath } from '@/utils/safePath';
import { getExport } from '@/utils/getExport';
import { safeString } from '@/utils/safeString';
import { prepareCode } from '@/utils/prepareCode';
import type { VueSvgCompileOptions } from '@/types';

export type CompileCodeResult = { code?: string; errors?: (string | Error)[]; tips?: string[] }

/**
 * Compiles SVG code
 */
export function compileCode(options: VueSvgCompileOptions): CompileCodeResult {
  const path = safePath(options.path);
  const isComponent = options.importType === 'component';
  const preparedCode = isComponent ? prepareCode(options.code) : options.code;
  const transformedCode = options.transform ? options.transform(preparedCode, options.importType, path) : preparedCode;

  if (!isComponent) {
    return { code: getExport(safeString(transformedCode)) };
  }

  try {
    const isProd = options.compileOptions?.isProd ?? false;

    const { code: renderCode, errors, tips } = compileTemplate({
      id: path,
      filename: path,
      source: transformedCode,
      // Disable asset URL transformation, as SVG is self-contained
      transformAssetUrls: false,
      ...options.compileOptions,
      compilerOptions: {
        // ↓ Static nodes are hoisted into constants outside the render function, improving re‑render performance
        hoistStatic: isProd,
        ...options.compileOptions?.compilerOptions,

        // ↓ Generate ES module with `export function render()`
        mode: 'module',
      },
    });

    if (errors?.length) {
      return { errors };
    }

    return { code: getExport('{ render }', renderCode), tips };
  } catch (error) {
    return { errors: [error as string | Error] };
  }
}

/**
 * SVG transformation
 */
export default function transform(options: VueSvgCompileOptions) {
  const result = compileCode(options);

  if (result.errors?.length) {
    const error = new Error(`Failed to compile SVG «${options.path}»`);
    error.cause = result.errors;

    throw error;
  }

  return result as { code: string; tips?: string[] };
}
