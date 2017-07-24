class Logger {
  constructor(file, options) {
    this.prefix = `${file.path}:`
    this.silent = options.silent
    this.verbose = options.verbose
  }

  log(...text) {
    if (!this.silent && this.verbose > 0)
      console.log('[LOG]', this.prefix, ...text)
  }

  warn(...text) {
    if(!this.silent) console.warn('[WARNING]', this.prefix, ...text)
  }

  error(...text) {
    if(!this.silent) console.error('[ERROR]', this.prefix, ...text)
  }

  /**
   * Show lines in the form (<start> to <end>) from a node.
   *
   * @param {Node} node
   * @return {String}
   */
  lines(node) {
    if (node.loc) {
      return `(${node.loc.start.line} to ${node.loc.end.line})`
    }
    return ''
  }
}

export default Logger
