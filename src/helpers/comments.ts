import { DocNodeComment, DocNodeTag } from '../schema'
import * as ts from 'typescript'
import { last, toArray, partial } from 'lodash'

export function getCommentFromSymbol (symbol: ts.Symbol): DocNodeComment {
  return toArray(symbol.declarations)
    .map(getCommentFromNode)
    .reduce((result, { comment, tags }) => {
      result.comment = result.comment ? `${result.comment}\n${comment}` : comment
      result.tags = result.tags.concat(tags)
      return result
    }, { comment: '', tags: [] })
}

export const hasJSDoc = <T extends ts.Node>(node: T): node is T & { jsDoc: ts.JSDoc[] } =>
  Array.isArray((node as any).jsDoc)

export const getJSDoc = (node: ts.Node): ts.JSDoc | undefined =>
  hasJSDoc(node) ? last(node.jsDoc) : undefined

export function getCommentFromNode (node: ts.Node): DocNodeComment {
  const doc = getJSDoc(node)

  return doc ? createCommentFromJSDoc(doc) : {
    comment: '',
    tags: []
  }
}

export function getFileComment (file: ts.SourceFile): DocNodeComment {
  const comment: DocNodeComment = {
    comment: '',
    tags: []
  }

  if (!file.statements.length) return comment

  const first = file.statements[0]
  if (hasJSDoc(first) && first.jsDoc.length > 1) {
    const doc = first.jsDoc[0]
    return createCommentFromJSDoc(doc)
  }

  return comment
}

function getCommentFromPropertyLikeTag (tagNames: string[], node: ts.Node, name: string): string {
  const doc = getJSDoc(node)
  if (!doc) return ''

  const tag = toArray(doc.tags)
    .filter(tag => tagNames.includes(tag.tagName.text))
    .map(tag => {
      // "@param arg.0" will result in the name "arg." as 0 is not a valid identifier.
      // To support documenting tuples, override this.
      const badCommentSplit = ts.isJSDocPropertyLikeTag(tag) && tag.name.getText().endsWith('.')

      const fullText = [tag.getText(), tag.comment || '']
        .join(badCommentSplit ? '' : ' ')

      const [, tagName, comment] = fullText.match(/^@\w+\s+([$\w.]+)\s+(.*)$/)!
      return {
        tagName, comment
      }
    })
    .find(tag => tag.tagName === name)
  return tag ? tag.comment || '' : ''
}

export const getPropertyComment = partial(getCommentFromPropertyLikeTag, ['property', 'prop'])
export const getParamComment = partial(getCommentFromPropertyLikeTag, ['param'])

export function createCommentFromJSDoc (node: ts.JSDoc): DocNodeComment {
  return {
    comment: node.comment || '',
    tags: toArray(node.tags)
      .map(createTag)
      .filter(tag => !['param', 'prop', 'property'].includes(tag.tagName))
  }
}

function createTag (tag: ts.JSDocTag): DocNodeTag {
  return {
    tagName: tag.tagName.text,
    // For some strange reason, tags sometimes only have \r separating lines.
    comment: (tag.comment || '').replace(/\r\n|\r|\n/g, '\n')
  }
}
