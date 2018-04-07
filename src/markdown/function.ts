import { convertFunction as convertFunctionSymbol } from '../json/function'
import { MarkdownBuilder } from './builder'
import { Symbol } from 'ts-simple-ast'
import { hasJSDocIgnoreTag, stringifyType, stringifyTags, stringifyFunctionSignature } from '../helpers'
import { FunctionSignatureDocNode } from '../json/schema'

export function convertFunction (node: Symbol, builder: MarkdownBuilder): void {
  const doc = convertFunctionSymbol(node)
  const signatures = doc.signatures.filter(s => !hasJSDocIgnoreTag(s))

  if (signatures.length === 0) return

  builder.header(`Function ${doc.name}`)

  signatures.forEach(signature => documentSignature(signature, builder))
}

// Todo: Better parameter lists - recurse.

function documentSignature (signature: FunctionSignatureDocNode, builder: MarkdownBuilder): void {
  builder.paragraph(signature.jsdoc.comment)
  .paragraph(`\`${stringifyFunctionSignature(signature)}\``)
  .paragraph(stringifyTags(signature.jsdoc.tags))

  if (signature.parameters.length) {
    builder.paragraph('**Parameters**')

    signature.parameters.forEach(param => {
      builder.list(param.name + ` \`${stringifyType(param)}\` ${param.comment}`)
    })

    builder.line()
  }
}
