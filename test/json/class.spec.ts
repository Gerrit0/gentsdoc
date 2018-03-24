import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('class.d.ts')

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

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.classes[index])
  t.snapshot(doc.classes[index])
}))

test('Correct number of documented classes', async t => {
  const doc = await docs
  t.is(doc.classes.length, tests.length)
})
