import { DocNodeComment, DocNodeTag } from '../json/schema'
import { complement } from 'ramda'

export function hasJSDocIgnoreTag (tag: { jsdoc: DocNodeComment }): boolean {
  return tag.jsdoc.tags.some(tag => tag.tagName === 'ignore')
}

export const isNotIgnored: (tag: { jsdoc: DocNodeComment }) => boolean = complement(hasJSDocIgnoreTag)

export function stringifyTags (tags: DocNodeTag[]): string {
  if (!tags.length) return ''
  return ' - ' + tags.map(tag => `\`@${tag.tagName}\` ${tag.comment}`.trim()).join('\n - ')
}
