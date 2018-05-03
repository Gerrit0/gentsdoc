import * as fs from 'fs-extra'
import { resolve } from 'path'
import { Minimatch } from 'minimatch'

// Helper to ensure that all minimatch patterns use { dot: true } and remove leading ./ or .\
export const makeMinimatch = (pattern: string) => new Minimatch(
  /^\.[\\/]/.test(pattern) ? pattern.substr(2) : pattern,
  { dot: true }
)

const makeMatchTest = (patterns: string[]) => {
  const matchers = patterns.map(makeMinimatch)
  return (path: string) => matchers.some(m => m.match(path))
}

/**
 * Searches for all files matching the include pattern and not matching the exclude pattern.
 * @return an array of paths.
 */
export function findFiles (include: string[], exclude: string[] = [], from: string = '.'): string[] {
  const isIncluded = makeMatchTest(include)
  const isExcluded = makeMatchTest(exclude)

  function searchDir (dir: string): string[] {
    const result: string[] = []

    for (const entry of fs.readdirSync(dir)) {
      const full = (dir === '.' ? '' : `${dir}/`) + entry
      if (isExcluded(full)) continue

      if (fs.statSync(full).isDirectory()) {
        result.push(...searchDir(full))
      } else {
        if (isIncluded(full)) result.push(full)
      }
    }

    return result
  }

  return searchDir(from)
}

export function readJsonSync (file: string): any {
  const json = fs.readJsonSync(file, { encoding: 'utf-8' })
  if (!json) throw new Error('JSON.parse returned null')
  return json
}

export function ensureDir (dir: string): void {
  fs.ensureDirSync(dir)
}
