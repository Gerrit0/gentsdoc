import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/variable-other.d.ts']

const [docs] = app.documentFiles('test')

test('No variable members', t => {
  t.is(docs.variables.length, 0)
})

test('Correct number of functions', t => {
  t.is(docs.functions.length, 1)
})

test('A function variable', t => {
  t.truthy(docs.functions[0])
  t.snapshot(docs.functions[0])
})
