import type { WebpackPluginInstance, Compiler } from 'webpack';
import type { SvgLoaderOptions } from '@/webpack-loader';

export interface VueSvgWebpackPluginOptions extends SvgLoaderOptions {
  /**
   * Asset module configuration for SVG files (without ?raw or ?component)
   * @default { filename: 'assets/svg/[name].[hash:8][ext]' }
   */
  asset?: { filename?: string; publicPath?: string };

  /**
   * Regular expression to detect SVG import types (?raw, ?component, etc.)
   * @default /\?(raw|component)/
   */
  regex?: RegExp
}

const DEFAULT_REGEX = /\?(raw|component)/;
const DEFAULT_ASSET_FILENAME = 'assets/svg/[name].[hash:8][ext]';

/**
 * Webpack/Rspack plugin for SVG transformation
 */
export default class webpackPlugin implements WebpackPluginInstance {
  constructor(private options?: VueSvgWebpackPluginOptions) {}

  apply(compiler: Compiler) {
    const rules = compiler.options.module.rules;
    const svgRuleIndex = rules.findIndex(rule => {
      if (!rule || typeof rule !== 'object' || !rule.test) {
        return false;
      }

      return rule.test.toString().includes('svg');
    });

    if (svgRuleIndex !== -1) {
      // Remove existing SVG rules to avoid conflicts
      rules.splice(svgRuleIndex, 1);
    }

    rules.unshift({
      test: /\.svg$/i,
      type: 'javascript/auto', // Disable automatic asset module detection
      oneOf: [
        {
          resourceQuery: this.options?.regex || DEFAULT_REGEX,
          use: [{ loader: 'vue-svg-plugin/webpack-loader', options: this.options }]
        },
        {
          type: 'asset/resource',
          generator: {
            filename: this.options?.asset?.filename || DEFAULT_ASSET_FILENAME,
            publicPath: this.options?.asset?.publicPath,
          }
        }
      ]
    });
  }

  /**
   * ChainWebpack configuration helper (for Vue CLI, etc.)
   */
  static chainWebpack(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any,
    options?: VueSvgWebpackPluginOptions
  ) {
    if (!config?.module?.rules?.delete) {
      throw new Error('Invalid webpack config provided to chainWebpack');
    }

    config.module.rules.delete('svg');

    config.module
      .rule('svg')
      .test(/\.svg$/)
      .type('javascript/auto') // Disable automatic asset module detection
      .oneOf('vue-svg')
      .resourceQuery(options?.regex || DEFAULT_REGEX)
      .use('vue-svg-plugin')
      .loader('vue-svg-plugin/webpack-loader')
      .options(options)
      .end()
      .end()
      .oneOf('asset')
      .type('asset/resource')
      .generator({
        filename: options?.asset?.filename || DEFAULT_ASSET_FILENAME,
        publicPath: options?.asset?.publicPath,
      });
  }
}
