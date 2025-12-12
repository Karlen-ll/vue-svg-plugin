import { describe, it } from 'mocha'
import webpackSvgLoader from '@/webpack-loader'

// Mock loader context
const createMockLoaderContext = (options = {}) => {
  return {
    resourcePath: assetsPath('sample.svg'),
    resourceQuery: '',
    query: options,
    async: () => (err: Error | null, result?: string) => {
      if (err) throw err
      return result
    },
    callback: sinon.stub()
  }
}

describe('Webpack SVG Loader', () => {
  it('should process SVG as component by default', async () => {
    const source = await readAsset('sample.svg')
    const context = createMockLoaderContext()

    const result = webpackSvgLoader.call(context as any, source)

    expect(result).to.be.a('string')
    expect(result).to.contain('export default { render: render }')
  })

  it('should handle raw import type', async () => {
    const source = await readAsset('sample.svg')
    const context = {
      ...createMockLoaderContext({ defaultImport: 'raw' }),
      resourceQuery: '?raw'
    }

    const result = webpackSvgLoader.call(context as any, source)

    expect(result).to.be.a('string')
    expect(result).to.contain('export default')
    expect(result ? JSON.parse(result.split('export default ')[1]) : '').to.contain('<svg')
  })

  it('should respect resourceQuery option', async () => {
    const source = await readAsset('sample.svg')
    const customRegex = /\.svg(\?custom)?$/
    const context = {
      ...createMockLoaderContext({ resourceQuery: customRegex }),
      resourcePath: assetsPath('sample.svg'),
      resourceQuery: '?custom'
    }

    const result = webpackSvgLoader.call(context as any, source)
    expect(result).to.contain('export default { render: render }')
  })

  it('should handle SVG with style tags', async () => {
    const source = await readAsset('sample-with-style.svg')
    const context = createMockLoaderContext()

    const result = webpackSvgLoader.call(context as any, source)

    expect(result).to.contain('<component is="style"')
    expect(result).to.contain('</component')
  })

  it('should handle compilation errors gracefully', async () => {
    const invalidSvg = 'invalid svg content'
    const context = createMockLoaderContext({ silent: false })

    const result = webpackSvgLoader.call(context as any, invalidSvg)

    // При ошибке компиляции должен вернуть исходный код
    expect(result).to.equal(invalidSvg)
  })

  it('should use silent mode', async () => {
    const invalidSvg = 'invalid svg content'
    const consoleStub = sinon.stub(console, 'error')
    const context = createMockLoaderContext({ silent: true })

    const result = webpackSvgLoader.call(context as any, invalidSvg)

    expect(result).to.equal(invalidSvg)
    expect(consoleStub.called).to.be.false

    consoleStub.restore()
  })
})
