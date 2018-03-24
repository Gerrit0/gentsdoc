import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('variable-other.d.ts')

test('No variable members', async t => {
  const doc = await docs
  t.is(doc.variables.length, 0)
})

test('Correct number of functions', async t => {
  const doc = await docs
  t.is(doc.functions.length, 1)
})

test('A function variable', async t => {
  const doc = await docs
  t.truthy(doc.functions[0])
  t.snapshot(doc.functions[0])
})
