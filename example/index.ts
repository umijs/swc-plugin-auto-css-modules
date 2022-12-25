import { transformSync } from '@swc/core'
import assert from 'assert'

const result = transformSync(
  `
import a from 'foo.less';
import b from 'foo.scss';
import c from 'foo.sass';
import d from '../foo.css';
import e from './foo.styl';
import { f } from 'foo';
import * as g from 'foo';
a, b, c, d, e, f, g;
`,
  {
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
        plugins: [[require.resolve('../swc_plugin_auto_css_modules.wasm'), {}]],
      },
      minify: {
        mangle: false,
        compress: false,
      },
    },
    minify: false,
    filename: 'index.ts',
    sourceMaps: false,
  }
)

assert(
  result.code.trim() ===
    `
import a from "foo.less?modules";
import b from "foo.scss?modules";
import c from "foo.sass?modules";
import d from "../foo.css?modules";
import e from "./foo.styl?modules";
import { f } from "foo";
import * as g from "foo";
a, b, c, d, e, f, g;
`.trim()
)
