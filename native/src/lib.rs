use napi::bindgen_prelude::{Buffer, Error, Result};
use napi_derive::napi;

const NOT_IMPLEMENTED_MESSAGE: &str =
    "calamine.js native workbook opening is not implemented yet; see the roadmap milestone for PR 3.";

#[napi(object)]
pub struct NativeBootstrapStatus {
    pub stage: String,
    pub supported_formats: Vec<String>,
    pub package_version: String,
}

#[napi]
pub fn bootstrap_status() -> NativeBootstrapStatus {
    NativeBootstrapStatus {
        stage: "bootstrap".to_owned(),
        supported_formats: vec![
            "xlsx".to_owned(),
            "xls".to_owned(),
            "xlsb".to_owned(),
            "ods".to_owned(),
        ],
        package_version: env!("CARGO_PKG_VERSION").to_owned(),
    }
}

#[napi]
pub fn open_workbook_from_file(_path: String) -> Result<()> {
    Err(not_implemented())
}

#[napi]
pub fn open_workbook_from_buffer(_data: Buffer) -> Result<()> {
    Err(not_implemented())
}

fn not_implemented() -> Error {
    Error::from_reason(NOT_IMPLEMENTED_MESSAGE)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bootstrap_status_lists_supported_formats() {
        let status = bootstrap_status();

        assert_eq!(status.stage, "bootstrap");
        assert_eq!(status.package_version, env!("CARGO_PKG_VERSION"));
        assert!(status.supported_formats.iter().any(|format| format == "xlsx"));
        assert!(status.supported_formats.iter().any(|format| format == "xls"));
        assert!(status.supported_formats.iter().any(|format| format == "xlsb"));
        assert!(status.supported_formats.iter().any(|format| format == "ods"));
    }

    #[test]
    fn placeholder_exports_remain_unimplemented() {
        let error = open_workbook_from_file("fixtures/example.xlsx".to_owned())
            .expect_err("placeholder should return an error");

        assert!(error.to_string().contains("not implemented yet"));
    }
}
