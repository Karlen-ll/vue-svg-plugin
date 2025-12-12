import { describe, it } from 'mocha'
import viteSvgLoader from '@/vite-plugin'

describe('Vite SVG Loader Plugin', () => {
  it('should create plugin with default options', () => {
    const plugin = viteSvgLoader()
    expect(plugin.name).to.equal('svg-loader')
    expect(plugin.enforce).to.equal('pre')
  })

  it('should handle raw import type', async () => {
    const plugin = viteSvgLoader({ defaultImport: 'raw' })

    // Имитируем вызов load метода
    const id = assetsPath('sample.svg')
    const result = await (plugin.load as any)(id)

    expect(result).to.be.a('string')
    expect(result).to.contain('export default')
    expect(result).to.contain('<svg')
  })

  it('should handle component import type', async () => {
    const plugin = viteSvgLoader({ defaultImport: 'component' })

    const id = assetsPath('sample.svg')
    const result = await (plugin.load as any)(id)

    expect(result).to.be.a('string')
    expect(result).to.contain('export default { render: render }')
    expect(result).to.contain('function render')
  })

  it('should preserve style tags in SVG', async () => {
    const plugin = viteSvgLoader()

    const id = assetsPath('sample-with-style.svg')
    const result = await (plugin.load as any)(id)

    expect(result).to.contain('<component is="style"')
    expect(result).to.contain('</component')
  })

  it('should handle query parameters in import path', async () => {
    const plugin = viteSvgLoader()

    const id = `${assetsPath('sample.svg')}?raw`
    const result = await (plugin.load as any)(id)

    expect(result).to.be.a('string')
    expect(result).to.contain('export default')
  })

  it('should return undefined for non-SVG files', async () => {
    const plugin = viteSvgLoader()

    const result = await (plugin.load as any)('somefile.js')
    expect(result).to.be.undefined
  })

  it('should handle silent mode', async () => {
    const plugin = viteSvgLoader({ silent: true })

    // Пробуем загрузить несуществующий файл
    const id = '/non/existent/file.svg'
    const result = await (plugin.load as any)(id)

    expect(result).to.be.undefined
    // Не должно быть console.warn в silent mode
  })
})
