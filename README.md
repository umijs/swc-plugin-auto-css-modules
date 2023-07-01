# swc-plugin-auto-css-modules

Auto css modules plugin for swc.

## Install

```bash
  pnpm i -D swc-plugin-auto-css-modules
```

You should install the following versions:

|`@swc/core` version|working version|
|:-:|:-:|
| `latest` > version >= `1.3.63`|`swc-plugin-auto-css-modules@1.5.0`|
| `1.3.63` > version >= `1.3.41`|`swc-plugin-auto-css-modules@1.4.0`|
| `1.3.41` > version >= `1.3.24`|`swc-plugin-auto-css-modules@1.3.0`|

## Usage

```diff
// swc config
{
  jsc: {
    experimental: {
      plugins: [
+       ['swc-plugin-auto-css-modules', {}]
      ],
    },
  }
}
```

### Auto css modules

This plugin will auto add the `?modules` suffix.

```ts
import styles from './index.less'
// to
import styles from './index.less?modules'
```

### Lock `core-js` import

Lock `core-js` import by config `lock_core_js_pkg_path`.

```ts
plugins: [
  [
    'swc-plugin-auto-css-modules',
    { lock_core_js_pkg_path: dirname(require.resolve('core-js/package.json')) },
  ],
]
```

```ts
import 'core-js/es/modules'
// to
import '/node_modules/**/core-js/es/modules'
```

## Config

See [types](./index.d.ts) file

```ts
import type { ISwcPluginAutoCssModulesConfig } from 'swc-plugin-auto-css-modules'
```

## License

MIT
