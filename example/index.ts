import assert from 'assert'
import { transform } from './_do'

const result = transform(`
import a from 'foo.less';
import b from 'foo.scss';
import c from 'foo.sass';
import d from '../foo.css';
import e from './foo.styl';
import { f } from 'foo';
import * as g from 'foo';
a, b, c, d, e, f, g;
`)

assert(
  result.code.trim() ===
    `
import a from "foo.less?modules";
import b from "foo.scss?modules";
import c from "foo.sass?modules";
import d from "../foo.css?modules";
import e from "./foo.styl?modules";
import { f } from 'foo';
import * as g from 'foo';
a, b, c, d, e, f, g;
`.trim()
)
