import { DocNodeComment, DocNodeTag } from '../json/schema'

export function hasJSDocIgnoreTag (tag: { jsdoc: DocNodeComment }): boolean {
  return tag.jsdoc.tags.some(tag => tag.tagName === 'ignore')
}

export function stringifyTags (tags: DocNodeTag[]): string {
  if (!tags.length) return ''
  return ' - ' + tags.map(tag => `\`@${tag.tagName}\` ${tag.comment}`.trim()).join('\n - ')
}
