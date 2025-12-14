import { SFCTemplateCompileOptions } from '@vue/compiler-sfc';

export type SvgType = 'url' | 'raw' | 'component' | string
export type AliasMap = Record<string, SvgType>

export type CompileOptions = Omit<SFCTemplateCompileOptions, 'id' | 'source' | 'filename' | 'isProd'>
export type TransformSvg = (code: string, importType: string, path: string) => string

/** Options for the SVG adapter/plugin */
export type VueSvgPluginOptions = {
  /** Default import type if not specified in query
   * @default 'url' */
  defaultType?: SvgType

  /** Map custom query parameters to standard import types */
  aliasMap?: AliasMap

  /** Custom transformation function for SVG content */
  transform?: TransformSvg

  /** Vue compilation options
   * @desc defaults compilerOptions: transformAssetUrls: false, hoistStatic: isProd */
  compileOptions?: CompileOptions
}

/** Options for SVG compilation */
export type VueSvgCompileOptions = {
  path: string
  code: string
  importType: SvgType
  transform?: TransformSvg
  compileOptions?: CompileOptions & Pick<SFCTemplateCompileOptions, 'isProd'>
}
