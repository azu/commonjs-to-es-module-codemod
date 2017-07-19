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

const ಠ_ಠ =
/* Toggle this line first `/` for verbose/silent transformation
  console.log
/*/
  function(){}
//*/

function transformer(file, api) {
  const j = api.jscodeshift;

  // ------------------------------------------------------------------ SEARCH
  const nodes = j(file.source)
    .find(j.ExpressionStatement, {
      expression: {
        callee: {
          name: 'require'
        }
      }
    }).filter(path => j.Program.check(path.parent.value));

  ಠ_ಠ(`${file.path}: ${nodes.length} nodes will be transformed`)

  // ----------------------------------------------------------------- REPLACE
  return nodes.replaceWith(path => {
    const sourcePath = path.node.expression.arguments.pop()
    return j.importDeclaration([], sourcePath)
  }).toSource();
}

module.exports = transformer
