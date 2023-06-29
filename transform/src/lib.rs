use serde::Deserialize;
use swc_core::ecma::{
    ast::{ImportDecl, ImportSpecifier},
    visit::{as_folder, noop_visit_mut_type, VisitMut, VisitMutWith, Fold},
};

pub struct TransformVisitor {
    pub config: Config,
}

const CSS_EXTS: [&str; 5] = [".css", ".less", ".scss", ".sass", ".styl"];
const CORE_JS: &str = "core-js/";

impl VisitMut for TransformVisitor {
    noop_visit_mut_type!();

    fn visit_mut_import_decl(&mut self, n: &mut ImportDecl) {
        n.visit_mut_children_with(self);

        self.rewrite_css_file_import(n);

        self.rewrite_core_js_import(n);
    }
}

impl TransformVisitor {
    fn rewrite_core_js_import(&self, n: &mut ImportDecl) {
        let core_js_pkg_path = self.config.lock_core_js_pkg_path.to_string();
        if core_js_pkg_path.len() == 0 {
            return
        }
        let source = n.src.value.to_string();
        if source.starts_with(CORE_JS) {
            let ends = source.replace(CORE_JS, "");
            n.src = Box::new(format!("{}/{}", core_js_pkg_path, ends).into());
        }
    }
}

impl TransformVisitor {
    fn is_css_file(&self, value: &String) -> bool {
        for ext in CSS_EXTS {
            if value.ends_with(ext) {
                return true;
            }
        }
        false
    }

    fn rewrite_css_file_import(&self, n: &mut ImportDecl) {
        if n.specifiers.len() == 1 {
            if let ImportSpecifier::Default(_) = &n.specifiers[0] {
                let import_source = n.src.value.to_string();
                if self.is_css_file(&import_source) {
                    n.src = Box::new(
                        format!("{}{}", import_source, self.config.style_file_suffix).into(),
                    );
                }
            }
        }
    }
}

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    #[serde(default = "get_default_lock_core_js_pkg_path")]
    pub lock_core_js_pkg_path: String,

    #[serde(default = "get_default_style_file_suffix")]
    pub style_file_suffix: String,
}

fn get_default_style_file_suffix() -> String {
    "?modules".to_string()
}

fn get_default_lock_core_js_pkg_path() -> String {
    "".to_string()
}

pub fn auto_css_modules(config: Config) -> impl Fold + VisitMut {
    as_folder(TransformVisitor { config })
}
