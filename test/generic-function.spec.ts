import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/generic-function.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'Identity',
  'Logging Identity',
  'getProperty',
  'createInstance',
  'Default type'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.functions[index])
  t.snapshot(docs.functions[index])
}))

test('Correct number of documented functions', t => {
  t.is(docs.functions.length, tests.length)
})
