import test from 'ava'

import { Application } from '../src'

const app = new Application()
app.include = ['test/alias.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'A basic type',
  'A union type',
  'Another union',
  'Typeof',
  'Function declaration',
  'An object',
  'Another object',
  'Intersection type',
  'A tuple type',
  'Another tuple type'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.types[index])
  t.snapshot(docs.types[index])
}))

test('Correct number of documented aliases', t => {
  t.is(docs.types.length, tests.length)
})
