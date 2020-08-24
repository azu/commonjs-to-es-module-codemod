import toImportDefault from "./require-to-import-default";
import toNamedImport from "./require-with-props-to-named-import";
import toExportDefault from "./module-exports-to-export-default";
import toNamedExport from "./module-exports-to-named-export";
import singleRequire from "./single-require";

const transformScripts = (fileInfo, api, options) => {
    return [toExportDefault, toNamedImport, singleRequire, toImportDefault, toNamedExport].reduce((input, script) => {
        return script(
            {
                source: input
            },
            api,
            options
        );
    }, fileInfo.source);
};

module.exports = transformScripts;
