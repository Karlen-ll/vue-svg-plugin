import { compileTemplate } from 'vue/compiler-sfc'
import type { WebpackLoaderContext } from './types'
import { SVG_QUERY_REGEX } from "@/const";
import { getErrorMessage } from "@/utils";

export default function webpackSvgLoader(
  this: WebpackLoaderContext,
  source: string
) {
  if (!this.getOptions) {
    return
  }

  const options = this.getOptions()
  const {
    defaultImport,
    silent = false,
  } = options

  // Проверяем, должен ли этот loader обрабатывать файл
  const resourcePath = this.resourcePath

  // Для проверки используем полный путь с query
  const fullResource = resourcePath + (this.resourceQuery || '')

  if (!fullResource.match(SVG_QUERY_REGEX)) {
    return source
  }

  const query = this.resourceQuery?.replace('?', '') || ''
  const importType = query || defaultImport

  if (importType === 'raw') {
    return `export default ${JSON.stringify(source)}`
  }

  // To prevent compileTemplate from removing the style tag
  const svg = source.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')

  const { code, errors } = compileTemplate({
    id: JSON.stringify(fullResource),
    source: svg,
    filename: resourcePath,
    transformAssetUrls: false
  })

  if (errors?.length > 0) {
    if (!silent) {
      console.error(getErrorMessage(`Failed to compile SVG ${resourcePath}:\n${errors.join('\n')}`))
    }
    return source
  }

  return `${code}\nexport default { render: render }`
}
