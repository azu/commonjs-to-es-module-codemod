# commonjs-to-es-module-codemod

jscodeshift codemod that convert CommonJS(require/exports) to ES Modules(import/export) for JavaScript/TypeScript

## Support

### Exports

- [x] named export: `module.exports.foo = foo` & `exports.foo = foo` to `export { foo }`
- [x] named export: `module.exports.bar = foo` & `exports.bar = foo` to `export { foo as bar }`
- [x] default export: `module.exports = foo` to `export default foo`
- [x] ignore multiple `module.exports = x`

### Imports

- [x] `require("mod")` to `import "mod"`
- [x] `const foo = require("mod")` to `import foo from "mod"`
- [x] `const { foo } = require("mod")` to `import { foo } from "mod"`
- [x] `const foo = require("mod").foo` to `import { foo } from "mod"`
- [x] `const bar = require("mod").foo` to `import { foo as bar } from "mod"`
- [ ] `const o = { foo: require("foo") } ` to `import foo from "mod"; const o = { foo }`

## Usage

Convert `index.js` and `index.ts` to ES modules codes using [jscodeshift](https://github.com/facebook/jscodeshift)

    # Install jscodeshift
    npm install --global jscodeshift
    # Transform
    LATEST_VERSION=$(npm view commonjs-to-es-module-codemod version)
    jscodeshift -t "https://unpkg.com/commonjs-to-es-module-codemod@${LATEST_VERSION}/dist/index.js" "index.js"
    # Transform TypeScript
    jscodeshift -t "https://unpkg.com/commonjs-to-es-module-codemod@${LATEST_VERSION}/dist/index.js" --extensions ts "index.ts"

Convert `src/*.js`:

    LATEST_VERSION=$(npm view commonjs-to-es-module-codemod version)
    find src -name "*.js" | xargs jscodeshift -t "https://unpkg.com/commonjs-to-es-module-codemod@${LATEST_VERSION}/dist/index.js"


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
