import {defineTest} from 'jscodeshift/dist/testUtils'

const tests = [
  'basic-case',
  'chained-requires-with-rest',
  'chained-requires',
]

describe('variable-require-to-import-default', () => {
  tests.forEach(test => {
    defineTest(
      __dirname,
      'variable-require-to-import-default',
      null,
      `variable-require-to-import-default/${test}`
    )
  })
})
