import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

const CONFIG_PATH = './tsconfig.json';

/**
 * Creates a Rollup configuration for bundling a source file into CommonJS and ESM formats,
 * along with declaration (.d.ts) file generation.
 *
 * @param {string} fileName - The name of the file (without extension)
 * @returns {import('rollup').RollupOptions[]}
 */
function includeFile(fileName) {
  const isCore = fileName === 'core';

  return [
    {
      input: `src/${fileName}.ts`,
      output: [
        { file: `dist/${fileName}.cjs`, format: 'cjs', exports: isCore ? 'named' : 'default' },
        { file: `dist/${fileName}.mjs`, format: 'esm' }
      ],
      external: ['vue/compiler-sfc'],
      plugins: [
        typescript({ tsconfig: CONFIG_PATH, compilerOptions: { removeComments: true } }),
        terser({ format: { comments: false } })
      ]
    },
    {
      input: `src/${fileName}.ts`,
      output: [{ file: `dist/${fileName}.d.ts`, format: 'esm' }],
      plugins: [dts({ tsconfig: CONFIG_PATH })]
    }
  ];
}

export default defineConfig([
  ...includeFile('core'),
  ...includeFile('vite-plugin'),
  ...includeFile('webpack-plugin'),
  ...includeFile('webpack-loader'),
]);
