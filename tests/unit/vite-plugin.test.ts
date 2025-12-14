import { describe, it, vi, expect } from 'vitest';
import transform from '@/core';
import vitePlugin, { type SvgPluginOptions } from '@/vite-plugin';
import { getImportType } from '@/utils/importType';
import {
  TEST_PATH,
  TEST_CODE,
  MOCK_TRANSFORM_RESULT as MOCK_RESULT,
} from '../const';
import type { SvgType } from '@/types';

vi.mock('@/core');
vi.mock('@/utils/importType');

describe('vitePlugin', () => {
  const mockTransform = vi.mocked(transform);
  const mockGetImportType = vi.mocked(getImportType);
  const mockPluginWarn = vi.fn();

  const callPlugin = (importType: SvgType = '', options: SvgPluginOptions = {}, hasTransformError = false): Promise<any> => {
    mockGetImportType.mockReturnValue(importType || options.defaultType || 'url');

    if (hasTransformError) {
      mockTransform.mockImplementation(() => {
        throw new Error('Test error');
      });
    } else {
      mockTransform.mockReturnValue(MOCK_RESULT);
    }

    const plugin = vitePlugin(options) as any;
    plugin.configResolved!({ isProduction: true });

    return plugin.load.call({
      warn: mockPluginWarn,
      fs: { readFile: vi.fn().mockResolvedValue(TEST_CODE) }
    }, importType === 'virtual' ? `virtual:${TEST_PATH}` : TEST_PATH);
  };

  it('skips virtual modules', async () => {
    expect(await callPlugin('virtual')).toBeUndefined();
  });

  it('call getImportType', () => {
    const options = { defaultType: 'base64' };
    callPlugin(undefined, options);

    expect(mockGetImportType).toHaveBeenCalledWith(expect.anything(), options);
  });

  it('skip file', async () => {
    expect(await callPlugin('url')).toBeUndefined();
    expect(mockTransform).not.toHaveBeenCalled();
  });

  it('calls transform', async () => {
    const options = { compileOptions: { compilerOptions: { sourceMap: true } } };

    expect(await callPlugin('raw')).toBe(MOCK_RESULT.code);
    expect(await callPlugin('base64')).toBe(MOCK_RESULT.code);
    expect(await callPlugin('component', options)).toBe(MOCK_RESULT.code);

    expect(mockTransform).toHaveBeenCalledTimes(3);
    expect(mockTransform).toHaveBeenCalledWith({
      code: TEST_CODE,
      path: TEST_PATH,
      importType: 'component',
      compileOptions: { isProd: true, ...options.compileOptions },
    });
  });

  it('handles errors', async () => {
    expect(await callPlugin('component', undefined, true)).toBeNull();
    expect(mockPluginWarn).toHaveBeenCalled();
  });
});
