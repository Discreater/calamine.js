use std::{io::Cursor, path::Path};

use calamine::{open_workbook_auto, open_workbook_auto_from_rs, Reader, Sheets};
use napi::bindgen_prelude::{Buffer, Error as NapiError, Result};
use napi_derive::napi;

#[napi(object)]
pub struct NativeWorkbookSummary {
    pub format: String,
    pub sheet_names: Vec<String>,
}

#[napi]
pub fn open_workbook_from_file(path: String) -> Result<NativeWorkbookSummary> {
    if path.is_empty() {
        return Err(NapiError::from_reason(
            "openWorkbookFromFile expects a non-empty file path.",
        ));
    }

    let workbook =
        open_workbook_auto(&path).map_err(|error| NapiError::from_reason(error.to_string()))?;

    Ok(workbook_summary(
        &workbook,
        format_from_path(&path).unwrap_or_else(|| workbook_format(&workbook).to_owned()),
    ))
}

#[napi]
pub fn open_workbook_from_buffer(data: Buffer) -> Result<NativeWorkbookSummary> {
    if data.is_empty() {
        return Err(NapiError::from_reason(
            "openWorkbookFromBuffer expects a non-empty Buffer or Uint8Array.",
        ));
    }

    let workbook = open_workbook_auto_from_rs(Cursor::new(data.to_vec()))
        .map_err(|error| NapiError::from_reason(error.to_string()))?;

    Ok(workbook_summary(&workbook, workbook_format(&workbook).to_owned()))
}

fn workbook_summary<RS>(workbook: &Sheets<RS>, format: String) -> NativeWorkbookSummary
where
    RS: std::io::Read + std::io::Seek,
{
    NativeWorkbookSummary {
        format,
        sheet_names: workbook.sheet_names(),
    }
}

fn workbook_format<RS>(workbook: &Sheets<RS>) -> &'static str {
    match workbook {
        Sheets::Xls(_) => "xls",
        Sheets::Xlsx(_) => "xlsx",
        Sheets::Xlsb(_) => "xlsb",
        Sheets::Ods(_) => "ods",
    }
}

fn format_from_path(path: &str) -> Option<String> {
    Path::new(path)
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| extension.to_ascii_lowercase())
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;

    fn fixture_path(name: &str) -> String {
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("..")
            .join("fixtures")
            .join(name)
            .display()
            .to_string()
    }

    #[test]
    fn opens_workbook_from_file_and_reads_metadata() {
        let summary =
            open_workbook_from_file(fixture_path("workbook.xlsx")).expect("expected fixture to open");

        assert_eq!(summary.format, "xlsx");
        assert_eq!(summary.sheet_names, vec!["Overview", "Data"]);
    }

    #[test]
    fn opens_workbook_from_buffer_and_reads_metadata() {
        let bytes = std::fs::read(fixture_path("workbook.xlsx")).expect("expected fixture bytes");
        let summary = open_workbook_from_buffer(Buffer::from(bytes)).expect("expected fixture to open");

        assert_eq!(summary.format, "xlsx");
        assert_eq!(summary.sheet_names, vec!["Overview", "Data"]);
    }
}
