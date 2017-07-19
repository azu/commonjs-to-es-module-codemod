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

// on https://astexplorer.net: Press ctrl+space for code completion

const Logger = require('./utils/logger')

const {isTopNode} = require('./utils/filters')

function transformer(file, api, options) {
  const j = api.jscodeshift
  const ಠ_ಠ = new Logger(file, options)

  // ------------------------------------------------------------------ SEARCH
  const nodes = j(file.source)
    .find(j.ExpressionStatement, {
      expression: {
        callee: {
          name: 'require'
        }
      }
    }).filter(isTopNode)

  ಠ_ಠ.log(`${nodes.length} nodes will be transformed`)

  // ----------------------------------------------------------------- REPLACE
  return nodes.replaceWith(path => {
    const sourcePath = path.node.expression.arguments.pop()
    return j.importDeclaration([], sourcePath)
  }).toSource()
}

module.exports = transformer
