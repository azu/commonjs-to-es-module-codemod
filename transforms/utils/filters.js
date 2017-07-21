import j from 'jscodeshift'

const isTopNode = (path) => j.Program.check(path.parent.value)

export { isTopNode }
