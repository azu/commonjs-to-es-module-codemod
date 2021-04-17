# commonjs-to-es-module-codemod

jscodeshift codemod that convert CommonJS(require/exports) to ES Modules(import/export) for JavaScript/TypeScript

## Support

### Exports

- [x] named export: `module.exports.foo = foo` to `export { foo }`
- [x] default export: `module.exports = foo` to `export default foo`
- [x] ignore multiple `module.exports = x`

### Imports

- [x] `const foo = require("mod")` to `import foo from "mod"`
- [x] `const { foo } = require("mod")` to `import { foo } from "mod"`
- [x] `const foo = require("mod").foo` to `import { foo } from "mod"`
- [x] `const bar = require("mod").foo` to `import { foo as bar } from "mod"`
- [ ] `const o = { foo: require("foo") } ` to `import foo from "mod"; const o = { foo }`
- [ ] Non-root require: `{ prop: require("mod") }`

## Usage

Convert files in `src/**/*` to ES modules codes using [jscodeshift](https://github.com/facebook/jscodeshift)

    # Install jscodeshift
    npm install --global jscodeshift
    # Transform
    jscodeshift -t https://unpkg.com/commonjs-to-es-module-codemod@0.4.1/dist/index.js "src/**/*"

## Tests

    yarn test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT © azu

It includes [BuonOmo/CommonJS-to-ES6-codemod](https://github.com/BuonOmo/CommonJS-to-ES6-codemod).

MIT © Ulysse Buonomo <buonomo.ulysse@gmail.com>


## Related

- [lebab/lebab: Turn your ES5 code into readable ES6. Lebab does the opposite of what Babel does.](https://github.com/lebab/lebab)
