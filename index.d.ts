export interface ISwcPluginAutoCssModulesConfig {
  /**
   * lock core-js package root path
   * @default undefined
   * @example dirname(require.resolve('core-js/package.json'))
   */
  lock_core_js_pkg_path?: string

  /**
   * auto add style file suffix
   * @default '?modules'
   * @example '?module-mark'
   */
  style_file_suffix?: string
}
