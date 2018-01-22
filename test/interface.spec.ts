import test from 'ava'

import { Application } from '../src/application'

const app = new Application()
app.include = ['test/interface.d.ts']

const [docs] = app.documentFiles('test')

const tests = [
  'Labeled',
  'Property tags',
  'Optional properties',
  'Readonly properties',
  'Indexed properties',
  'Methods',
  'Constructor',
  'Shape',
  'Shape2',
  'Square extends Shape, Shape2',
  'Hybrid types',
  'Merged interfaces'
]

tests.forEach((title, index) => test(title, t => {
  t.truthy(docs.interfaces[index])
  t.snapshot(docs.interfaces[index])
}))

test('Correct number of documented functions', t => {
  t.is(docs.interfaces.length, tests.length)
})
