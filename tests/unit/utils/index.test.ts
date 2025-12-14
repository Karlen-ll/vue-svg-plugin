import { describe, it, expect } from 'vitest';
import { safePath } from '@/utils/safePath';
import { prepareCode } from '@/utils/prepareCode';

const STYLES = '.sample{fill:blue;}';

describe('Utils', () => {
  describe('prepareComponent', () => {
    [
      { value: '', result: '' },
      { value: '<svg></svg>', result: '<svg></svg>' },

      {
        value: `<svg><STYLE>${STYLES}</STYLE></svg>`,
        result: `<svg><component is="style">${STYLES}</component></svg>`
      },

      {
        value: `<svg><style>${STYLES}</style></svg>`,
        result: `<svg><component is="style">${STYLES}</component></svg>`,
      },
      {
        value: `<svg><style>${STYLES}</style><circle r="10"/><style>${STYLES}</style></svg>`,
        result: `<svg><component is="style">${STYLES}</component><circle r="10"/><component is="style">${STYLES}</component></svg>`,
      },
    ].forEach(({ value, result }, index) => {
      it(`Test ${index + 1}`, () => {
        expect(prepareCode(value)).toBe(result);
      });
    });
  });

  describe('safePath', () => {
    [
      { path: '', result: '' },
      { path: './file.svg', result: './file.svg' },
      { path: 'file.svg?raw', result: 'file.svg' },
      { path: 'file.svg?raw&inline', result: 'file.svg' },

      { path: 'file.svg?', result: 'file.svg' },
      { path: 'file.svg?#hash', result: 'file.svg#hash' },

      { path: 'file.svg#hash', result: 'file.svg#hash' },
      { path: 'file.svg?raw#long-hash', result: 'file.svg#long-hash' },
      { path: 'file.svg?raw&type=icon#hash', result: 'file.svg#hash' },
    ].forEach(({ path, result }, index) => {
      it(`Test ${index + 1}: should return "${result}"`, () => {
        expect(safePath(path)).toBe(result);
      });
    });

    describe('keepHash = false', () => {
      [
        { path: '', result: '' },
        { path: './file.svg', result: './file.svg' },

        { path: 'file.svg?', result: 'file.svg' },
        { path: 'file.svg?raw', result: 'file.svg' },
        { path: 'file.svg?#hash', result: 'file.svg' },

        { path: 'file.svg#hash', result: 'file.svg' },
        { path: 'file.svg?raw#long-hash', result: 'file.svg' },
        { path: 'file.svg?raw&type=icon#hash', result: 'file.svg' },
      ].forEach(({ path, result }, index) => {
        it(`Test ${index + 1}: should return "${result}"`, () => {
          expect(safePath(path, false)).toBe(result);
        });
      });
    });
  });
});
