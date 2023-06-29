use swc_core::{
    ecma::{ast::Program, visit::FoldWith},
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

#[plugin_transform]
pub fn auto_css_modules(program: Program, data: TransformPluginProgramMetadata) -> Program {
    let config = serde_json::from_str(
        &data
            .get_transform_plugin_config()
            .expect("failed to get plugin config for auto_css_modules"),
    )
    .expect("invalid packages");

    program.fold_with(&mut auto_css_modules::auto_css_modules(config))
}
