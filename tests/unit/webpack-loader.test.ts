import { describe, it, vi, expect } from 'vitest';
import transform from '@/core';
import webpackLoader, { type SvgLoaderOptions } from '@/webpack-loader';
import { getImportType } from '@/utils/importType';
import {
  TEST_PATH,
  TEST_CODE,
  TEST_URL,
  MOCK_TRANSFORM_RESULT as MOCK_RESULT,
} from '../const';
import type { SvgType } from '@/types';

vi.mock('@/core');
vi.mock('@/utils/handleError');
vi.mock('@/utils/importType');

describe('webpackLoader', () => {
  const mockTransform = vi.mocked(transform);
  const mockGetImportType = vi.mocked(getImportType);
  const mockLoaderWarn = vi.fn();

  const callLoader = (importType: SvgType = '', options: SvgLoaderOptions = {}, hasTransformError = false) => {
    mockGetImportType.mockReturnValue(importType || options.defaultType || 'url');

    if (hasTransformError) {
      mockTransform.mockImplementation(() => {
        throw new Error('Test error');
      });
    } else {
      mockTransform.mockReturnValue(MOCK_RESULT);
    }

    return webpackLoader.call({
      resourcePath: TEST_PATH,
      resourceQuery: importType ? `?${importType}` : '',
      emitWarning: mockLoaderWarn,
      cacheable: vi.fn(),
      mode: 'production' as const,
      getOptions: () => options
    } as any, TEST_CODE);
  };

  it('call getImportType', () => {
    const options = { defaultType: 'base64' };
    callLoader(undefined, options);

    expect(mockGetImportType).toHaveBeenCalledWith(expect.anything(), options);
  });

  it('return url', () => {
    expect(callLoader('url')).toBe(TEST_URL);
    expect(mockTransform).not.toHaveBeenCalled();
  });

  it('calls transform', () => {
    const options = { compileOptions: { compilerOptions: { sourceMap: true } } };

    expect(callLoader('raw')).toBe(MOCK_RESULT.code);
    expect(callLoader('base64')).toBe(MOCK_RESULT.code);
    expect(callLoader('component', options)).toBe(MOCK_RESULT.code);

    expect(mockTransform).toHaveBeenCalledTimes(3);
    expect(mockTransform).toHaveBeenCalledWith({
      code: TEST_CODE,
      path: TEST_PATH,
      importType: 'component',
      compileOptions: { isProd: true, ...options.compileOptions },
    });
  });

  it('handle error', () => {
    expect(callLoader('component', undefined, true)).toBe(TEST_URL);
    expect(mockLoaderWarn).toHaveBeenCalled();
  });
});
