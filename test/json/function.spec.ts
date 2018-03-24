import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('function.d.ts')

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
  'Rest within an object + multiple signatures',
  'A type reference'
]

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.functions[index])
  t.snapshot(doc.functions[index])
}))

test('Correct number of documented functions', async t => {
  const doc = await docs
  t.is(doc.functions.length, tests.length)
})
