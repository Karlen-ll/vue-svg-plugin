# Vue SVG plugin
Vue пакет для преобразования SVG файлов, включающий plugin для Vite и loader для Webpack/Rspack.

**Преимущества**:
- 🚀 **Минимальные зависимости** — только `vue`, ядро на чистом TypeScript;
- ⚡ **Высокая производительность** — использует компилятор Vue с оптимизацией и гибкой настройкой через опции;
- 🔧 **Модульная архитектура** — ядро можно использовать для создания адаптеров под другие сборщики;
- 🏅 **Рейтинг SonarQube `A`** — высокое качество кода и надёжность.

---

## Оглавление 📑

- [Установка](#установка-)
- [Настройка](#настройка-)
  - [Параметры](#параметры)
- [Пример использования](#пример-использования-)
  - [SVGO](#svgo-)
  - [Добавление типа](#добавление-типа-)
  - [TypeScript](#typescript-)

## Languages

[English](README.md), [Español](README.es.md), [Deutsch](README.de.md), [中文](README.zh.md), [Русский](README.ru.md)

---

## Установка 📦

```bash
npm install vue-svg-plugin --save-dev
```
```bash
yarn add vue-svg-plugin --save-dev
```

## Настройка ⚙️

### Vite

Поддерживаемые версии Vite: `^5.0.0 || ^6.0.0 || ^7.0.0`

```js
// vite.config.js
import vueSvgPlugin from 'vue-svg-plugin/vite'

export default defineConfig({
  plugins: [vue(), vueSvgPlugin({/* опции */})]
})
```

#### Nuxt 🚀

```ts
// nuxt.config.js
import vueSvgPlugin from 'vue-svg-plugin/vite'

export default defineNuxtConfig({
  vite: { plugins: [vueSvgPlugin({/* опции */})] }
})
```

### Webpack

```js
// webpack.config.js
const VueSvgPlugin = require('vue-svg-plugin/webpack');

module.exports = {
  plugins: [new VueSvgPlugin({/* опции */})],
}
```

либо самому описать правила загрузки модулей 

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        oneOf: [
          { resourceQuery: /\?(raw|component)/, use: [{ loader: 'vue-svg-plugin/webpack-loader', options: {} }] },
          { type: 'asset/resource', generator: { filename: 'assets/svg/[name].[hash:8][ext]' } }
        ]
      }
    ]
  }
}
```

### Rspack

```js
// rspack.config.js
const VueSvgPlugin = require('vue-svg-plugin/webpack');

export default defineConfig({
  tools: {
    rspack: { plugins: [new VueSvgPlugin({/* опции */})] }
  }
});
```

#### Vue CLI

```js
// webpack.config.js
chainWebpack: (config) => {
  VueSvgPlugin.chainWebpack(config, {/* опции */});
}
```

### Параметры

| Параметр         | Тип                         | По умолчанию | Описание                                                           |
|------------------|-----------------------------|--------------|--------------------------------------------------------------------|
| `defaultType`    | `SvgType`                   | `'url'`      | Тип импорта по умолчанию                                           |
| `aliasMap`       | `Record<string, SvgType>`   | —            | Сопоставление кастомных query-параметров стандартным типам импорта |
| `regex`          | `RegExp`                    |              | Регулярное выражение для определения SVG файлов                    |
| `silent`         | `boolean`                   | `false`      | Подавлять вывод ошибок в консоль                                   |
| `transform`      | `TransformSvg`              | —            | Кастомная функция трансформации SVG контента                       |
| `compileOptions` | `SFCTemplateCompileOptions` | см. ниже     | Опции компиляции Vue                                               |

```ts
type SvgType = 'url' | 'raw' | 'component' | string

type TransformSvg = (code: string, importType: string, path: string) => string
```

Значение по умолчанию для `compileOptions`:

```json lines
{
  isProd: isProd,
  compilerOptions: { transformAssetUrls: false, hoistStatic: isProd },
}
```

## Пример использования 🚀

По умолчанию SVG файлы импортируются как `url` (стандартное поведение сборщика). Это можно изменить через параметр `defaultType`.

### Импорт как строка

```ts
import iconRaw from './icon.svg?raw'
// '<svg xmlns="...'
```

### Импорт как компонент

```ts
import IconComponent from './icon.svg?component'
// <IconComponent />
```

### Изменение типа импорта по умолчанию

```ts
// vite.config.js
vueSvgPlugin({ defaultType: 'component' })
```
Теперь все `.svg` файлы без явного query-параметра будут загружаться как компоненты Vue.

### SVGO 🎨

Рекомендуется предварительно обработать SVG-файлы с помощью SVGO отдельным скриптом,
чтобы избежать лишних вычислений при каждой сборке:

```bash
npx svgo src/assets/raw_icons -o src/assets/icons
```

Если необходимо оптимизировать SVG на лету, можно использовать параметр `transform`:

```ts
import { optimize } from 'svgo';

vueSvgPlugin({
  transform: (code, query, path) => query === 'component' ? optimizeSvg(code, { path }).data : code
})
```

### Добавление типа 🔧

В качестве примера добавим тип импорта `base64`:

```ts
vueSvgPlugin({
  regex: /\.svg(\?(raw|component|base64))?$/,
  transform: (code, query) => query === 'base64' ? btoa(code) : code
})
```

Для TypeScript добавьте декларацию типа:

```ts
declare module '*.svg?base64' {
  const src: string
  export default src
}
```

Теперь можно использовать:

```ts
import iconBase64 from './icon.svg?base64'
// 'PHN2ZyB4bWxucz0i...'
```

### Настройка алиасов

```ts
vueSvgPlugin({
  regex: /\.svg(\?(raw|cmp))?$/,
  aliasMap: { cmp: 'component' }, // ?cmp → component
})
```

### Настройка опций компилятора

```ts
vueSvgPlugin({
  compileOptions: { compilerOptions: { sourceMap: true, comments: false } }
})
```

### TypeScript 📘

Пакет включает декларации типов для:
- `*.svg` (по умолчанию как `url`)
- `*.svg?raw`
- `*.svg?component`

#### Способ 1: через reference

В `vite-env.d.ts`:
```ts
/// <reference types="vue-svg-plugin/types" />
```

#### Способ 2: через tsconfig.json

```json
{
  "compilerOptions": { "types": ["vue-svg-plugin/types"] }
}
```

## Поддержка ❤️

Если эта библиотека полезна для вас, рассмотрите возможность поддержать её разработку:

- [Patreon](https://www.patreon.com/collection/1924882)
- [Boosty](https://boosty.to/karlen/donate)

## Лицензия

MIT © [Karlen Pireverdiev](https://github.com/Karlen-ll)

## Ссылки
- [📝 История изменений](CHANGELOG.md)
- [💻 Исходный код](https://github.com/Karlen-ll/vue-svg-plugin)
- [🐛 Отчеты об ошибках](https://github.com/Karlen-ll/vue-svg-plugin/issues)
- [📦 NPM пакет](https://www.npmjs.com/package/vue-svg-plugin)

