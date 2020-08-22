import toImportDefault from "./variable-require-to-import-default";
import toExportDefault from "./module-exports-to-export-default";
import singleRequire from "./single-require";

const transformScripts = (fileInfo, api, options) => {
    return [toExportDefault, singleRequire, toImportDefault].reduce((input, script) => {
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
