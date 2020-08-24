/**
 * Transform
 *
 *   const a = require('lib').a;
 *
 * to
 *
 *   import { a } from 'lib';
 *
 * Only on global context
 */

// on https://astexplorer.net: Press ctrl+space for code completion

import Logger from "./utils/logger";
import { isTopNode } from "./utils/filters";

function transformer(file, api, options) {
    const j = api.jscodeshift;
    const logger = new Logger(file, options);

    // ------------------------------------------------------------------ SEARCH
    const nodes = j(file.source)
        .find(j.VariableDeclaration, {
            declarations: [
                {
                    init: {
                        type: "MemberExpression",
                        object: {
                            type: "CallExpression",
                            callee: {
                                name: "require"
                            }
                        }
                        // property
                    }
                }
            ]
        })
        .filter(isTopNode);

    logger.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    return nodes
        .replaceWith((path) => {
            const rest = [];
            const imports = [];
            for (const declaration of path.node.declarations) {
                // https://astexplorer.net/#/gist/49d222c86971cbe3e5744958989dc061/b0b5d0c31a6e74f63365c2ec1f195d3227c49621
                // const a = require("a").a
                const isRequireWithProp =
                    declaration.init !== null &&
                    declaration.init.type === "MemberExpression" &&
                    declaration.init.object.type === "CallExpression" &&
                    declaration.init.object.callee.name === "require" &&
                    declaration.init.property !== undefined;
                if (isRequireWithProp) {
                    if (declaration.id.type === "Identifier") {
                        const sourcePath = declaration.init.object.arguments.shift();
                        if (declaration.init.object.arguments.length) {
                            logger.error(
                                `${logger.lines(declaration)} too many arguments.` + "Aborting transformation"
                            );
                            return file.source;
                        }
                        if (!j.Literal.check(sourcePath)) {
                            logger.error(
                                `${logger.lines(declaration)} bad argument.` +
                                    "Expecting a string literal, got " +
                                    j(sourcePath).toSource() +
                                    "`. Aborting transformation"
                            );
                            return file.source;
                        }
                        if (declaration?.init?.property.type !== "Identifier") {
                            logger.log("Unknown declaration", declaration);
                            return file.source;
                        }
                        const propertyId = declaration.init.property;
                        const specify = j.importSpecifier(propertyId, propertyId);
                        imports.push(j.importDeclaration([specify], sourcePath));
                    } else if (declaration.id.type === "ObjectPattern") {
                        // named import
                        // const { c } = require("mod").a
                        logger.log("Does not support pattern", declaration);
                    }
                } else {
                    rest.push(declaration);
                }
            }
            if (rest.length > 0) {
                logger.warn(`${logger.lines(path.node)} introduced leftover`);
                return [...imports, j.variableDeclaration(path.node.kind, rest)];
            }
            return imports;
        })
        .toSource();
}

export default transformer;
