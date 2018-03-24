import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('alias.d.ts')

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

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.types[index])
  t.snapshot(doc.types[index])
}))

test('Correct number of documented aliases', async t => {
  const doc = await docs
  t.is(doc.types.length, tests.length)
})
