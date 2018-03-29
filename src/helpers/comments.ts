import { curry, flatMap } from 'lodash'
import Project, { JSDocableNode, SourceFile, Symbol, ts, Node, TypeGuards } from 'ts-simple-ast'
import { DocNodeComment } from '../schema'

/**
 * Tags which are removed for the comments
 */
const removeTags = [
  'param',
  'prop',
  'property',
  'returns',
  'return'
]

const normalizeNewlines = (s: string) => s.replace(/\r\n|\r/g, '\n')

export function getJSDocableNode (node: Node): Node & JSDocableNode {
  if (TypeGuards.isJSDocableNode(node)) return node
  return getJSDocableNode(node.getParentOrThrow())
}

/**
 * Gets the comment for a symbol, includes the concatenated comments from
 * each declaration and the tags from all declarations.
 */
export function getCommentFromSymbol (symbol: Symbol): DocNodeComment {
  return {
    comment: symbol.compilerSymbol.getDocumentationComment(undefined)
      .map(p => p.text)
      .map(normalizeNewlines)
      .join(''),
    tags: symbol.compilerSymbol.getJsDocTags()
      .map(tag => ({ tagName: tag.name, comment: normalizeNewlines(tag.text || '') }))
      .filter(tag => !removeTags.includes(tag.tagName))
  }
}

/**
 * Gets the comment from a node
 * @param node
 */
export function getCommentFromNode (node: JSDocableNode): DocNodeComment {
  const docs = node.getJsDocs()
  const tags = flatMap(docs, doc => doc.getTags())

  return {
    comment: docs.map(doc => doc.getComment() || '').join('\n'),
    tags: tags.map(tag => {
      const text = tag.getFullText() + tag.getComment()
      const [ tagName, ...words] = text.split(' ')

      return {
        tagName: tagName.substr(1),
        comment: normalizeNewlines(words.join(' '))
      }
    })
    .filter(tag => !removeTags.includes(tag.tagName))
  }
}

/**
 * Gets the module comment from a file, module comments must start with /***
 * @param file
 */
export function getFileComment (file: SourceFile): DocNodeComment {
  const emptyComment: DocNodeComment = {
    comment: '',
    tags: []
  }

  const commentRanges = ts.getLeadingCommentRanges(file.getFullText(), file.getFullStart())

  if (!commentRanges) return emptyComment

  const firstCommentText = file.getFullText()
    .substring(commentRanges[0].pos, commentRanges[0].end)

  if (!firstCommentText.startsWith('/***')) return emptyComment

  const fileProject = new Project()
  const commentFile = fileProject.createSourceFile(
    'comment.ts',
    firstCommentText.replace('/***', '/**') + '\ninterface a {}'
  )

  const int = commentFile.getInterfaceOrThrow('a')

  return getCommentFromNode(int)
}

function getCommentFromPropertyLikeTag (tagNames: string[], node: JSDocableNode, name: string): string {
  const tag = flatMap(node.getJsDocs(), doc => doc.getTags())
    .filter(tag => tagNames.includes(tag.getTagNameNode().getText()))
    .map(tag => {
      // "@param arg.0" will result in the name "arg." as 0 is not a valid identifier.
      // To support documenting tuples, override this.
      const badCommentSplit = ts.isJSDocPropertyLikeTag(tag.compilerNode) && tag.compilerNode.name.getText().endsWith('.')

      const fullText = [tag.getText(), tag.getComment() || '']
        .join(badCommentSplit ? '' : ' ')

      const [, tagName, comment] = fullText.match(/^@\w+\s+([$\w.]+)\s+(.*)$/)!
      return {
        tagName, comment
      }
    })
    .find(tag => tag.tagName === name)

  return tag && tag.comment || ''
}

/**
 * Gets the comment from a tag with the format `@prop property.path comment`
 * Supports both `@property` and `@prop`.
 */
export const getPropertyComment = curry(getCommentFromPropertyLikeTag)(['property', 'prop'])
/**
 * Gets `@param comments`
 */
export const getParamComment = curry(getCommentFromPropertyLikeTag)(['param'])

/**
 * Gets the `@return` or `@returns` comment for a function
 * @param node
 */
export function getReturnComment (node: JSDocableNode) {
  const tag = flatMap(node.getJsDocs(), doc => doc.getTags())
    .find(tag => ['return', 'returns'].includes(tag.getTagNameNode().getText()))

  return tag && tag.getComment() || ''
}
