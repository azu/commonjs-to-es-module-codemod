/**
 * Transform
 *
 *   const Lib = require('lib');
 *
 * to
 *
 *   import Lib from 'lib';
 *
 * Only on global context
 */

// on https://astexplorer.net: Press ctrl+space for code completion

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
        .find(j.VariableDeclaration, {
            declarations: [
                {
                    init: {
                        type: "CallExpression",
                        callee: {
                            name: "require"
                        }
                        // property
                    }
                }
            ]
        })
        .filter(isTopNode);

    logger.log(`${nodes.length} nodes will be transformed`);

    // ----------------------------------------------------------------- REPLACE
    nodes
        .replaceWith((path) => {
            const comments = path.node.comments;

            const rest = [];
            const imports = [];
            for (const declaration of path.node.declarations) {
                const isRequire =
                    declaration.init !== null &&
                    declaration.init.type === "CallExpression" &&
                    declaration.init.callee.name === "require";
                // https://astexplorer.net/#/gist/49d222c86971cbe3e5744958989dc061/b0b5d0c31a6e74f63365c2ec1f195d3227c49621
                // require("a").a
                const isRequireWithProp = isRequire && declaration.init.property !== undefined;
                if (isRequireWithProp) {
                    if (declaration.id.type === "Identifier") {
                        // default import
                        const sourcePath = declaration.init.arguments.shift();
                        if (declaration.init.arguments.length) {
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
                        if (declaration?.init?.property.type === "Identifier") {
                            logger.log("Unknown declaration", declaration);
                        }
                        const specify = j.importSpecifier(declaration.init.property, declaration?.init?.property);

                        const importDeclaration = j.importDeclaration([specify], sourcePath);
                        importDeclaration.comments = comments;
                        imports.push(importDeclaration);
                    } else if (declaration.id.type === "ObjectPattern") {
                        // named import
                        // const { c } = require("mod").a
                        logger.log("Does not support pattern", declaration);
                    }
                } else if (isRequire) {
                    if (declaration.id.type === "Identifier") {
                        // default import
                        const importSpecifier = j.importDefaultSpecifier(declaration.id);

                        const sourcePath = declaration.init.arguments.shift();
                        if (declaration.init.arguments.length) {
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

                        const importDeclaration = j.importDeclaration([importSpecifier], sourcePath);
                        importDeclaration.comments = comments;
                        imports.push(importDeclaration);
                    } else if (declaration.id.type === "ObjectPattern") {
                        // named import
                        // const { specifierA, specifierB } = require("mod")
                        // ObjectPattern
                        const specifiers = declaration.id.properties.map((property) => {
                            const key = j.identifier(property.key.name);
                            const value = j.identifier(property.value.name);
                            return j.importSpecifier(key, value);
                        });
                        const sourcePath = declaration.init.arguments.shift();
                        if (declaration.init.arguments.length) {
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

                        const importDeclaration = j.importDeclaration(specifiers, sourcePath);
                        importDeclaration.comments = comments;
                        imports.push(importDeclaration);
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

    // Restore comments
    getFirstNode().comments = firstNodeComments;

    return root.toSource();
}

export default transformer;
