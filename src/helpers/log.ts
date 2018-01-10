import * as ts from 'typescript'
import { getNodeSource } from './nodes'

export function warn (message: string): void
export function warn (message: string, node: ts.Node, file: ts.SourceFile): void
export function warn (message: string, ...args: any[]): void {
  const [node, file] = args
  if (!node) {
    console.warn('[Warning]', message)
  } else {
    const source = getNodeSource(node, file)
    warn(`${message} at ${source.file}:${source.line}:${source.character}`)
  }
}
