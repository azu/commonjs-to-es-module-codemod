/**
 * Transform
 *
 *   module.exports.a = *;
 *
 * to
 *
 *   export const a = *;
 *
 * Only on global context
 */

import Logger from "./utils/logger";
import { isTopNode } from "./utils/filters";

function transformer(file, api, options) {
    const j = api.jscodeshift;
    const logger = new Logger(file, options);

    const root = j(file.source);

    const getFirstNode = () => root.find(j.Program).get("body", 0).node;

    // Save the comments attached to the first node
    const firstNodeComments = getFirstNode().comments;

    const ast = root;

    // ------------------------------------------------------------------ SEARCH
    const nodes = root;
    const moduleExportNodes = ast
        .find(j.ExpressionStatement, {
            expression: {
                left: {
                    object: {
                        object: {
                            name: "module"
                        },
                        property: {
                            name: "exports"
                        }
                    }
                    // property is target
                },
                operator: "="
            }
        })
        .filter(isTopNode);

    const exportNodes = ast
        .find(j.ExpressionStatement, {
            expression: {
                left: {
                    object: {
                        name: "exports"
                    }
                    // property is target
                },
                operator: "="
            }
        })
        .filter(isTopNode);

    logger.log(`${moduleExportNodes.length + exportNodes.length} nodes will be transformed`);
    // ----------------------------------------------------------------- REPLACE
    const replace = (path) => {
        const node = path.node;
        // Identifier node
        const id = node.expression.left.property;
        const init = node.expression.right;
        // module.export.b = a
        // → export { a as b }
        if (id.type === "Identifier" && init.type === "Identifier") {
            // Workaround for https://github.com/benjamn/ast-types/issues/425#issuecomment-1007846129
            const specifier = j.exportSpecifier.from({
                exported: id,
                local: init
            });
            return j.exportNamedDeclaration(null, [specifier]);
        }
        // https://babeljs.io/docs/en/babel-types#exportnameddeclaration
        const declaration = j.variableDeclaration("const", [j.variableDeclarator(id, init)]);
        return j.exportNamedDeclaration(declaration);
    };

    exportNodes.replaceWith(replace);
    moduleExportNodes.replaceWith(replace);

    // Restore comments
    getFirstNode().comments = firstNodeComments;

    return root.toSource();
}

export default transformer;
