import test from 'ava'
import { getFileDocs } from './helpers'

const docs = getFileDocs('variable.d.ts')

const tests = [
  'const',
  'let',
  'var',
  'An object type',
  'Numeric literal',
  'Exported later'
]

tests.forEach((title, index) => test(title, async t => {
  const doc = await docs
  t.truthy(doc.variables[index])
  t.snapshot(doc.variables[index])
}))

test('Correct number of documented variables', async t => {
  const doc = await docs
  t.is(doc.variables.length, tests.length)
})
