import { describe, it, expect } from 'vitest';
import { getImportType } from '@/utils/importType';

describe('importType', () => {
  describe('getImportType', () => {
    [
      { path: '', result: 'url' },
      { path: '?', result: 'url' },
      { path: 'raw', result: 'url' },

      { path: '?raw', result: 'raw' },
      { path: '?inline', result: 'inline' },

      { path: '?raw=true', result: 'raw' },
      { path: '?raw&type=icon', result: 'raw' },
      { path: 'file.svg?raw', result: 'raw' },

      { path: 'file.svg?cmp', options: { aliasMap: { cmp: 'component' } }, result: 'component' },
    ].forEach(({ path, result, options }, index) => {
      it(`Test ${index + 1}: should return "${result}"`, () => {
        expect(getImportType(path, options)).toBe(result);
      });
    });
  });
});
