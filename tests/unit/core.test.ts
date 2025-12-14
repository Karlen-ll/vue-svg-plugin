import { describe, it, expect, vi, beforeEach } from 'vitest';
import { compileTemplate } from 'vue/compiler-sfc';
import transform, { compileCode } from '@/core';
import { safePath } from '@/utils/safePath';
import { safeString } from '@/utils/safeString';
import { prepareCode } from '@/utils/prepareCode';
import {
  TEST_PATH,
  TEST_CODE,
  TEST_DATA,
  MOCK_COMPILE_ERROR,
  MOCK_COMPILE_SUCCESS,
  MOCK_TRANSFORM_RESULT as MOCK_RESULT
} from '../const';

vi.mock('vue/compiler-sfc');
vi.mock('@/utils/safePath', () => ({ safePath: vi.fn((path: string) => path) }));
vi.mock('@/utils/safeString', () => ({ safeString: vi.fn((str: string) => `'${str}'`) }));
vi.mock('@/utils/prepareCode', () => ({ prepareCode: vi.fn((code: string) => code) }));

describe('compileCode', () => {
  const mockCompileTemplate = vi.mocked(compileTemplate);
  const mockPrepareCode = vi.mocked(prepareCode);
  const mockSafeString = vi.mocked(safeString);
  const mockSafePath = vi.mocked(safePath);

  beforeEach(() => {
    mockCompileTemplate.mockReset();
    mockPrepareCode.mockClear();
    mockSafeString.mockClear();
    mockSafePath.mockClear();
  });

  describe.each(['raw', 'url'] as const)('importType: %s', (importType) => {
    it('exports raw string', () => {
      expect(compileCode({ ...TEST_DATA, importType }).code).toBe(`export default '${TEST_CODE}'`);

      expect(mockSafeString).toHaveBeenCalled();
      expect(mockPrepareCode).not.toHaveBeenCalled();
      expect(mockCompileTemplate).not.toHaveBeenCalled();
    });

    it('applies transform function', () => {
      const transformFn = vi.fn();

      compileCode({ ...TEST_DATA, importType, transform: transformFn });

      expect(transformFn).toHaveBeenCalledWith(TEST_CODE, importType, TEST_PATH);
      expect(mockPrepareCode).not.toHaveBeenCalled();
    });
  });

  describe('importType: component', () => {
    it('calls methods', () => {
      mockCompileTemplate.mockReturnValue(MOCK_COMPILE_SUCCESS);
      compileCode(TEST_DATA);

      expect(mockPrepareCode).toHaveBeenCalledWith(TEST_CODE);
      expect(mockSafePath).toHaveBeenCalledWith(TEST_PATH);
      expect(mockCompileTemplate).toHaveBeenCalledWith({
        id: TEST_PATH,
        filename: TEST_PATH,
        source: TEST_CODE,
        transformAssetUrls: false,
        compilerOptions: {  mode: 'module', hoistStatic: false }
      });
    });

    it('includes production options', () => {
      mockCompileTemplate.mockReturnValue(MOCK_COMPILE_SUCCESS);

      compileCode({
        ...TEST_DATA,
        importType: 'component',
        compileOptions: { isProd: true, compilerOptions: { comments: false } }
      });

      expect(mockCompileTemplate.mock.calls[0][0].compilerOptions).toMatchObject({
        mode: 'module',
        comments: false,
        hoistStatic: true
      });
    });

    it('returns code with render export', () => {
      mockCompileTemplate.mockReturnValue(MOCK_COMPILE_SUCCESS);

      expect(compileCode(TEST_DATA).code).toBe(MOCK_RESULT.code);
    });

    it('returns errors on failure', () => {
      mockCompileTemplate.mockReturnValue(MOCK_COMPILE_ERROR);

      expect(compileCode(TEST_DATA).errors).toEqual(MOCK_COMPILE_ERROR.errors);
    });
  });
});

describe('transform', () => {
  const mockCompileTemplate = vi.mocked(compileTemplate);

  beforeEach(() => {
    mockCompileTemplate.mockReset();
  });

  it('returns compiled code', () => {
    mockCompileTemplate.mockReturnValue(MOCK_COMPILE_SUCCESS);

    expect(transform(TEST_DATA)).toEqual(MOCK_RESULT);
  });

  it('throws on error', () => {
    mockCompileTemplate.mockReturnValue(MOCK_COMPILE_ERROR);

    expect(() => transform(TEST_DATA)).toThrow();
  });
});
