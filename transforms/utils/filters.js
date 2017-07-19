const j = require('jscodeshift')

const isTopNode = (path) => j.Program.check(path.parent.value)

module.exports = { isTopNode }
