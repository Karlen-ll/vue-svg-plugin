import { promises as fs } from 'node:fs'
import { compileTemplate } from 'vue/compiler-sfc'
import { getErrorMessage } from "@/utils";
import { SVG_QUERY_REGEX } from "@/const";
import type { VitePlugin, SvgLoaderOptions } from './types'

export default function viteSvgPlugin(options: SvgLoaderOptions = {}) {
  const { defaultImport, silent = false } = options

  const plugin: VitePlugin = {
    name: 'svg-loader',
    enforce: 'pre',

    async load(id: string) {
      if (!id.match(SVG_QUERY_REGEX)) {
        return
      }

      const [path, query] = id.split('?', 2)
      const importType = query || defaultImport
      let svg: string

      try {
        svg = await fs.readFile(path, 'utf-8')
      } catch (error) {
        if (!silent) {
          console.warn(getErrorMessage(`${id} couldn't be loaded, fallback to default loader`))
        }
        return
      }

      if (importType === 'raw') {
        return `export default ${JSON.stringify(svg)}`
      }

      // To prevent compileTemplate from removing the style tag
      svg = svg.replace(/<style/g, '<component is="style"').replace(/<\/style/g, '</component')

      const { code, errors } = compileTemplate({
        id: JSON.stringify(id),
        source: svg,
        filename: path,
        transformAssetUrls: false,
        compilerOptions: {

        }
      })

      if (errors?.length > 0) {
        throw new Error(getErrorMessage(`Failed to compile SVG ${path}:\n${errors.join('\n')}`))
      }

      return `${code}\nexport default { render: render }`
    }
  }

  return plugin
}
