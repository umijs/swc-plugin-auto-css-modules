import assert from 'assert'
import { transform } from './_do'

const result = transform(
  `
import a from 'core-js';
import b from 'core-js/cc';
import c from 'core-js/cc/dd';

import 'core-js';
import 'core-js/cc';
import 'core-js/cc/dd';

import d from '../core-js';
import e from './core-js';
import { f } from 'foo';
import * as g from 'foo';

a, b, c, d, e, f, g;
  `,
  {
    lock_core_js_pkg_path: '/core-js/absolute-path',
    //   dirname(
    //     require.resolve('core-js/package.json')
    //   )
  }
)

assert(
  result.code.trim() ===
    `
import a from "core-js";
import b from "/core-js/absolute-path/cc";
import c from "/core-js/absolute-path/cc/dd";
import "core-js";
import "/core-js/absolute-path/cc";
import "/core-js/absolute-path/cc/dd";
import d from "../core-js";
import e from "./core-js";
import { f } from "foo";
import * as g from "foo";
a, b, c, d, e, f, g;
  `.trim()
)
