import { DocComment, DocNode, DocNodeKind, DocInlineTag, DocBlock } from '@microsoft/tsdoc'
import { template } from './template'

export function renderDoc (node?: DocComment): string[] {
  if (!node) return []
  const docs = [`<p>${renderDocNode(node.summarySection)}</p>`]
  if (node.remarksBlock) {
    docs.push(template`<details class="doc-remarks"><summary>Remarks</summary>
      ${[renderBlockTag(node.remarksBlock)]}
    </details>`)
  }
  return docs
}

function renderDocNode (node: DocNode): string {
  switch (node.kind) {
    case DocNodeKind.InlineTag:
      return renderInlineTag(node as DocInlineTag)
    case DocNodeKind.SoftBreak:
      return '<br>'
    case DocNodeKind.Block:
      return renderBlockTag(node as DocBlock)
    default:
      return node.excerpt ? node.excerpt.content.toString() : node.getChildNodes().map(renderDocNode).join('\n')
  }
}

function renderInlineTag (tag: DocInlineTag) {
  switch (tag.tagName) {
    case '@link':
      const [ target, text ] = tag.tagContent.split(' | ')
      return template`<a href="${target}">${text || target}</a>`
    default:
      // Not sure how to nicely handle unknown tags...
      return template`<pre>${tag.tagName}: ${tag.tagContent}</pre>`
  }
}

function renderBlockTag (tag: DocBlock) {
  return tag.getChildNodes().filter(n => n.kind !== DocNodeKind.BlockTag).map(renderDocNode).join('\n')
}
