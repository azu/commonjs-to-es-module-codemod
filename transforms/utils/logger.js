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
}

module.exports = Logger
