# swc-plugin-auto-css-modules

Auto css modules plugin for swc.

## Install

```bash
  pnpm i -D swc-plugin-auto-css-modules
```

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

This plugin will auto add the `?modules` suffix for webpack `resourceQuery`.

```ts
import styles from './index.less'
// to
import styles from './index.less?modules'
```

## License

MIT
