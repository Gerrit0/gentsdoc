import test from 'ava'

import { Application } from '../src'

const app = new Application()
app.include = ['test/function.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'A basic function',
  'A destructured function',
  'An object argument',
  'An interface argument',
  'A union argument',
  'A destructured tuple',
  'A nested tuple',
  'Array destructuring',
  'Messy destructuring',
  'Optional parameters',
  'Intersections and unions',
  'A rest parameter',
  'Rest within an object + multiple signatures'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.functions[index])
  t.snapshot(docs.functions[index])
}))

test('Correct number of documented functions', t => {
  t.is(docs.functions.length, tests.length)
})
