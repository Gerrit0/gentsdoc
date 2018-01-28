import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/class.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'A basic class',
  'A property method',
  'Extends and implements',
  'Visibility modifiers',
  'Extended visibility',
  'Readonly properties',
  'Generic class',
  'Static properties & methods',
  'Abstract class'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.classes[index])
  t.snapshot(docs.classes[index])
}))

test('Correct number of documented classes', t => {
  t.is(docs.classes.length, tests.length)
})
