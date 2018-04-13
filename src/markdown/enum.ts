import { Symbol } from 'ts-simple-ast'
import { hasJSDocIgnoreTag, isNotIgnored } from '../helpers'
import { convertEnum as convertEnumSymbol } from '../json/enum'
import { Alignment, MarkdownBuilder } from './builder'

export function convertEnum (symbol: Symbol, builder: MarkdownBuilder): void {
  const doc = convertEnumSymbol(symbol)

  if (hasJSDocIgnoreTag(doc)) return

  builder.header(`Enumeration ${doc.name}`)
    .paragraph(doc.jsdoc.comment)

  doc.jsdoc.tags.forEach(tag => builder.paragraph(`\`@${tag.tagName}\` ${tag.comment}`))

  builder.table(
    ['Name', 'Value', 'Comment'],
    [Alignment.left, Alignment.left, Alignment.left],
    doc.members
      .filter(isNotIgnored)
      .map(member => {
        return [
          member.name,
          member.value,
          member.jsdoc.comment
        ]
      })
  )
}
