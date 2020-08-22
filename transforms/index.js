const toExportDefault = require("./module-exports-to-export-default");
const singleRequire = require("./single-require");
const toImportDefault = require("./variable-require-to-import-default");

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
