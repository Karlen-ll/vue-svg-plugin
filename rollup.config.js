import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'named'
      },
      {
        file: 'dist/index.mjs',
        format: 'es'
      }
    ],
    external: ['vue/compiler-sfc', 'node:fs'],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/vite-plugin.ts',
    output: [
      {
        file: 'dist/vite-plugin.cjs',
        format: 'cjs',
        exports: 'default'
      },
      {
        file: 'dist/vite-plugin.mjs',
        format: 'es'
      }
    ],
    external: ['vue/compiler-sfc', 'node:fs'],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: 'src/webpack-loader.ts',
    output: [
      {
        file: 'dist/webpack-loader.cjs',
        format: 'cjs',
        exports: 'default'
      },
      {
        file: 'dist/webpack-loader.mjs',
        format: 'es'
      }
    ],
    external: ['vue/compiler-sfc'],
    plugins: [
      typescript({ tsconfig: './tsconfig.json' })
    ]
  }
]);
