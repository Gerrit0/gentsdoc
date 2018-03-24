import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('interface.d.ts')

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
  'Merged interfaces',
  'Property methods'
]

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.interfaces[index])
  t.snapshot(doc.interfaces[index])
}))

test('Correct number of documented functions', async t => {
  const doc = await docs
  t.is(doc.interfaces.length, tests.length)
})
