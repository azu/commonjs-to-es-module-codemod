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
    const logger = new Logger(file, options);

    const root = j(file.source);

    const getFirstNode = () => root.find(j.Program).get("body", 0).node;

    // Save the comments attached to the first node
    const firstNodeComments = getFirstNode().comments;

    // ------------------------------------------------------------------ SEARCH
    const nodes = root
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
        .filter(isTopNode);

    if (nodes.length > 1) {
        logger.error(
            "There should not be more than one `module.exports` declaration in a file. Aborting transformation"
        );
        return file.source;
    }

    logger.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    nodes.replaceWith((path) => {
        const comments = path.node.comments;
        const declaration = j.exportDefaultDeclaration(path.node.expression.right);
        declaration.comments = path.node.comments;
        return declaration;
    });

    // Restore comments
    getFirstNode().comments = firstNodeComments;

    return root.toSource();
}

export default transformer;
