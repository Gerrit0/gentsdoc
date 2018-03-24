import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('enum.d.ts')

const tests = [
  'A basic enum',
  'A const enum',
  'Merged declaration',
  'String enum',
  'Messy indexes'
]

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.enumerations[index])
  t.snapshot(doc.enumerations[index])
}))

test('Correct number of documented enumerations', async t => {
  const doc = await docs
  t.is(doc.enumerations.length, tests.length)
})
