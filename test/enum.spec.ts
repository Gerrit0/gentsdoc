import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/enum.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'A basic enum',
  'A const enum',
  'Merged declaration',
  'String enum',
  'Messy indexes'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.enumerations[index]) // Prevent undefined issues
  t.snapshot(docs.enumerations[index])
}))

test('Correct number of documented enumerations', t => {
  t.is(docs.enumerations.length, tests.length)
})
