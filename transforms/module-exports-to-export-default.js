/**
 * Transform
 *
 *   module.exports = *;
 *
 * to
 *
 *   export default *;
 *
 * Only on global context
 */

import Logger from "./utils/logger";
import { isTopNode } from "./utils/filters";

function transformer(file, api, options) {
    const j = api.jscodeshift;
    const _isTopNode = (path) => isTopNode(j, path);
    const logger = new Logger(file, options);

    // ------------------------------------------------------------------ SEARCH
    const nodes = j(file.source)
        .find(j.ExpressionStatement, {
            expression: {
                left: {
                    object: {
                        name: "module"
                    },
                    property: {
                        name: "exports"
                    }
                },
                operator: "="
            }
        })
        .filter(_isTopNode);

    if (nodes.length > 1) {
        logger.error(
            "There should not be more than one `module.exports` declaration in a file. Aborting transformation"
        );
        return file.source;
    }

    logger.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    return nodes
        .replaceWith((path) => {
            const newNode = j.exportDefaultDeclaration(path.node.expression.right);
            newNode.comments = path.node.comments;
            return newNode;
        })
        .toSource();
}

export default transformer;
