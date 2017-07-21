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

import Logger from './utils/logger'
import {isTopNode} from './utils/filters'

function transformer(file, api, options) {
  const j = api.jscodeshift
  const logger = new Logger(file, options)

  // ------------------------------------------------------------------ SEARCH
  const nodes = j(file.source)
    .find(j.VariableDeclaration, {
      declarations: [{
        init: {
          type: 'CallExpression',
          callee: {
            name: 'require'
          }
        }
      }]
    }).filter(isTopNode)

  logger.log(`${nodes.length} nodes will be transformed`)

  // ----------------------------------------------------------------- REPLACE
  return nodes.replaceWith(path => {
    const rest = []
    const imports = []
    for (const declaration of path.node.declarations) {
      if (declaration.init !== null
          && declaration.init.type === 'CallExpression'
          && declaration.init.callee.name === 'require'){
        const importSpecifier = j.importDefaultSpecifier(declaration.id)
        if (declaration.init.arguments.length > 1) {
          logger.warn(`(line ${declaration.loc.start.line}) too many arguments`)
        }
        const sourcePath = declaration.init.arguments.shift()
        imports.push(j.importDeclaration([importSpecifier], sourcePath))
      } else {
        rest.push(declaration)
      }
    }
    if (rest.length > 0) {
      logger.warn(`${logger.lines(path.node)} introduced leftover`)
      return [...imports, j.variableDeclaration(path.node.kind, rest)]
    }
    return imports
  }).toSource()
}

export default transformer
