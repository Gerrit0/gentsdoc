import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('generic-function.d.ts')

const tests = [
  'Identity',
  'Logging Identity',
  'getProperty',
  'createInstance',
  'Default type'
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
