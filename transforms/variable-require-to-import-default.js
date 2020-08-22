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

    // ------------------------------------------------------------------ SEARCH
    const nodes = j(file.source)
        .find(j.VariableDeclaration, {
            declarations: [
                {
                    init: {
                        type: "CallExpression",
                        callee: {
                            name: "require"
                        }
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
                if (
                    declaration.init !== null &&
                    declaration.init.type === "CallExpression" &&
                    declaration.init.callee.name === "require"
                ) {
                    try {
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
                            imports.push(j.importDeclaration([importSpecifier], sourcePath));
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
                            imports.push(j.importDeclaration(specifiers, sourcePath));
                        }
                    } catch (error) {
                        logger.error(file.path, error);
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
