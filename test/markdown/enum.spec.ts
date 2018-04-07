import test from 'ava'
import { getFileDocs } from './helpers'

test('Enumerations', async t => {
  const doc = await getFileDocs('enum.d.ts')
  t.truthy(doc)
  t.snapshot(doc)
})
