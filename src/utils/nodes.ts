import * as ts from 'typescript'
import * as tsdoc from '@microsoft/tsdoc'
import { chain, toArray } from './fp'

export function resolveExpression (node: ts.Expression | ts.ExpressionWithTypeArguments): string {
  // Resolve string literals with node.text to handle backslashes
  if (ts.isStringLiteral(node)) {
    return node.text
  }
  return node.getText()
}

export type Name = ts.Identifier | ts.StringLiteral | ts.NumericLiteral | ts.QualifiedName | ts.ComputedPropertyName

export function resolveName (name: Name): string {
  if (ts.isQualifiedName(name)) return resolveName(name.left) + '.' + name.right.text
  if (ts.isComputedPropertyName(name)) return resolveExpression(name.expression)
  return name.text
}

export function getCommentRange (declarations: ReadonlyArray<ts.Declaration> | ts.Declaration): tsdoc.TextRange | undefined {
  const ranges = chain(d => {
    const text = d.getSourceFile().getFullText()
    const comments = ts.getLeadingCommentRanges(d.getSourceFile().getFullText(), d.pos) || []
    // If a node has multiple leading comments, only take the last one.
    if (comments.length) {
      const range = comments[comments.length - 1]
      return tsdoc.TextRange.fromStringRange(text, range.pos, range.end)
    }
  }, toArray(declarations)).filter(isDocComment)

  // Take the longest doc comment
  return ranges.sort((a, b) => (b.end - b.pos) - (a.end - a.pos))[0]
}

export function isDocComment (range: tsdoc.TextRange) {
  return range.buffer.substring(range.pos, range.end).startsWith('/**')
    && !range.buffer.substring(range.pos, range.end).startsWith('/**/')
}
