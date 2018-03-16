import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/variable.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'const',
  'let',
  'var',
  'An object type',
  'Numeric literal',
  'Exported later'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.variables[index])
  t.snapshot(docs.variables[index])
}))

test('Correct number of documented variables', t => {
  t.is(docs.variables.length, tests.length)
})
