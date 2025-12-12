export interface SvgLoaderOptions {
  defaultImport?: 'url' | 'raw' | 'component'
  silent?: boolean
}

export interface WebpackSvgLoaderOptions extends SvgLoaderOptions {
  resourceQuery?: RegExp
}

// Минимальные типы для Vite
export interface VitePlugin {
  name: string;
  enforce?: 'pre' | 'post';
  transform?: (code: string, id: string) => Promise<{ code: string } | null | undefined>;
  load?: (id: string) => Promise<string | null | undefined> | string | null | undefined;
  resolveId?: (id: string) => Promise<string | null> | string | null;
}

// Минимальные типы для Webpack Loader
export interface WebpackLoaderContext {
  options?: WebpackSvgLoaderOptions

  // Основные свойства
  resourcePath: string
  resourceQuery: string
  rootContext: string
  context: string

  // Запрос и параметры
  query: string | WebpackSvgLoaderOptions
  getOptions?(): WebpackSvgLoaderOptions

  // Асинхронная обработка
  async(): (error: Error | null, content?: string, sourceMap?: any) => void
  callback(error: Error | null, content?: string, sourceMap?: any): void

  // Кэширование
  cacheable(flag?: boolean): void

  // Зависимости
  addDependency(file: string): void
  addContextDependency(directory: string): void

  // Ресурсы
  resource: string
  emitFile?(name: string, content: Buffer | string, sourceMap?: any): void

  // Режим
  mode: 'production' | 'development' | 'none'
  target: string
  webpack: boolean

  // Загрузчик
  loadModule?(
    request: string,
    callback: (err: Error | null, source: string, sourceMap: any, module: any) => void
  ): void

  // Пользовательские данные
  data?: any

  // Версия
  version: number

  // Опции

}

// Тип для Webpack loader функции
export type WebpackLoader = (
  this: WebpackLoaderContext,
  content: string,
  sourceMap?: any
) => string | void | Promise<string | void>

// Утилиты для парсинга query
export interface LoaderUtils {
  getOptions(context: WebpackLoaderContext): WebpackSvgLoaderOptions
  parseQuery(query: string): Record<string, any>
  stringifyRequest(loaderContext: WebpackLoaderContext, request: string): string
  urlToRequest(url: string, root?: string): string
  interpolateName(
    loaderContext: WebpackLoaderContext,
    name: string,
    options?: any
  ): string
  getHashDigest(
    content: Buffer | string,
    hashType: string,
    digestType: string,
    maxLength: number
  ): string
}

// Типы для Vue compiler
export interface VueCompilerOptions {
  id: string
  source: string
  filename: string
  transformAssetUrls?: boolean | Record<string, string[]>
}

export interface VueCompilerResult {
  code: string
  ast?: any
  errors?: string[]
  tips?: string[]
}

export interface VueTemplateCompiler {
  compileTemplate(options: VueCompilerOptions): VueCompilerResult
}

// Константы для типов импорта
export type SvgImportType = 'url' | 'raw' | 'component'
