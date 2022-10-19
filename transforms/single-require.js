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
    const logger = new Logger(file, options);

    const root = j(file.source);

    const getFirstNode = () => root.find(j.Program).get("body", 0).node;

    // Save the comments attached to the first node
    const firstNodeComments = getFirstNode().comments;

    // ------------------------------------------------------------------ SEARCH
    const nodes = root
        .find(j.ExpressionStatement, {
            expression: {
                callee: {
                    name: "require"
                }
            }
        })
        .filter(isTopNode);

    logger.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    nodes.replaceWith((path) => {
        const sourcePath = path.node.expression.arguments.pop();
        return j.importDeclaration([], sourcePath);
    });

    // Restore comments
    getFirstNode().comments = firstNodeComments;
    return root.toSource();
}

export default transformer;
