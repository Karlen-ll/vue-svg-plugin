import { describe, it } from 'mocha'

describe('Helper Functions', () => {
  it('should correctly build fixture paths', () => {
    const path = assetsPath('sample.svg')
    expect(path).to.contain('test/fixtures/sample.svg')
    expect(path).to.match(/[\\/]sample\.svg$/)
  })

  it('should read fixture files', async () => {
    const content = await readAsset('sample.svg')
    expect(content).to.contain('<svg')
    expect(content).to.contain('circle')
  })
})
