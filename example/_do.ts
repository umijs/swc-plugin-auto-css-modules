import { transformSync } from '@swc/core'
import type { ISwcPluginAutoCssModulesConfig } from '../'

export const transform = (
  code: string,
  opts: ISwcPluginAutoCssModulesConfig = {}
) => {
  return transformSync(code, {
    module: {
      type: 'es6',
      ignoreDynamic: true,
    },
    jsc: {
      parser: {
        syntax: 'typescript',
        dynamicImport: true,
        tsx: true,
      },
      target: 'es5',
      experimental: {
        plugins: [
          [
            require.resolve(
              '../target/wasm32-wasi/release/swc_plugin_auto_css_modules.wasm'
            ),
            opts,
          ],
        ],
      },
      minify: {
        mangle: false,
        compress: false,
      },
    },
    minify: false,
    filename: 'index.ts',
    sourceMaps: false,
  })
}
