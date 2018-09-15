type Placeholders = Array<string | string[] | undefined>

/**
 * Helper template function which escapes embedded strings.
 * Does not escape arrays of strings.
 * @param literals
 * @param placeholders
 */
export function template (literals: TemplateStringsArray, ...placeholders: Placeholders): string {
  let result = ''

  for (let i = 0; i < placeholders.length; i++) {
    result += literals[i]
    const placeholder = placeholders[i]
    if (typeof placeholder === 'string') {
      result += placeholder.replace(/[<>&'"]/g, char => `&#${char.charCodeAt(0)};`)
    } else if (placeholder) {
      result += placeholder.join('\n')
    }
  }

  result += literals[literals.length - 1]

  return result
}
