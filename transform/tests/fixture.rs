use auto_css_modules::{auto_css_modules, Config};
use std::{fs::read_to_string, path::PathBuf};
use swc_core::{
    common::{chain, Mark},
    ecma::parser::{EsConfig, Syntax},
    ecma::transforms::{
        base::resolver,
        testing::{test_fixture, FixtureTestConfig},
    },
};
use testing::fixture;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        jsx: true,
        ..Default::default()
    })
}

#[fixture("tests/fixture/**/input.js")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = read_to_string(dir.join("config.json")).expect("failed to read config.json");
    println!("---- Config -----\n{}", config);
    let config: Config = serde_json::from_str(&config).unwrap();
    test_fixture(
        syntax(),
        &|_t| {
            chain!(
                resolver(Mark::new(), Mark::new(), false),
                auto_css_modules(config.clone()),
            )
        },
        &input,
        &dir.join("output.js"),
        Default::default(),
    );
}
