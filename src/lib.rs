use swc_core::{
    ecma::{
        ast::{ImportDecl, ImportSpecifier, Program},
        transforms::testing::test,
        visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
    },
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

pub struct TransformVisitor;

const CSS_EXTS: [&str; 5] = [".css", ".less", ".scss", ".sass", ".styl"];

impl VisitMut for TransformVisitor {
    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        n.visit_mut_children_with(self);

        if n.specifiers.len() == 1 {
            if let ImportSpecifier::Default(_default_specifier) = &n.specifiers[0] {
                let source = n.src.value.to_string();
                for ext in CSS_EXTS {
                    if source.ends_with(ext) {
                        n.src = Box::new(format!("{}?modules", source).into());
                        break;
                    }
                }
            }
        }
    }
}

#[plugin_transform]
pub fn auto_css_modules(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(TransformVisitor))
}

test!(
    Default::default(),
    |_| as_folder(TransformVisitor),
    boo,
    r#"
import a from 'foo.less';
import b from 'foo.scss';
import c from 'foo.sass';
import d from '../foo.css';
import e from './foo.styl';
import { f } from 'foo';
import * as g from 'foo';
"#,
    r#"
import a from "foo.less?modules";
import b from "foo.scss?modules";
import c from "foo.sass?modules";
import d from "../foo.css?modules";
import e from "./foo.styl?modules";
import { f } from 'foo';
import * as g from 'foo';
"#
);
