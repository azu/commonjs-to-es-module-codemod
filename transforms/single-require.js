/**
 * Transform
 *
 *   require('lib');
 *
 * to
 *
 *   import 'lib';
 *
 * Only on global context
 */

import Logger from "./utils/logger";
import { isTopNode } from "./utils/filters";

function transformer(file, api, options) {
    const j = api.jscodeshift;
    const _isTopNode = (path) => isTopNode(j, path);
    const ಠ_ಠ = new Logger(file, options);

    // ------------------------------------------------------------------ SEARCH
    const nodes = j(file.source)
        .find(j.ExpressionStatement, {
            expression: {
                callee: {
                    name: "require"
                }
            }
        })
        .filter(_isTopNode);

    ಠ_ಠ.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    return nodes
        .replaceWith((path) => {
            const sourcePath = path.node.expression.arguments.pop();
            return j.importDeclaration([], sourcePath);
        })
        .toSource();
}

export default transformer;
