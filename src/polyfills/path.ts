/* eslint-disable @stylistic/max-len */


export interface ParsedPath {

  /**
   * The root of the path such as '/' or 'c:\'
   */
  root: string

  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir: string

  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base: string

  /**
   * The file extension (if any) such as '.html'
   */
  ext: string

  /**
   * The file name without extension (if any) such as 'index'
   */
  name: string
}


export interface FormatInputPathObject {

  /**
   * The root of the path such as '/' or 'c:\'
   */
  root?: string | undefined

  /**
   * The full directory path such as '/home/user/dir' or 'c:\path\dir'
   */
  dir?: string | undefined

  /**
   * The file name including extension (if any) such as 'index.html'
   */
  base?: string | undefined

  /**
   * The file extension (if any) such as '.html'
   */
  ext?: string | undefined

  /**
   * The file name without extension (if any) such as 'index'
   */
  name?: string | undefined
}


export interface PathImpl {

  /**
   * Normalize a string path, reducing '..' and '.' parts.
   * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used. If the path is a zero-length string, '.' is returned, representing the current working directory.
   *
   * @param path string path to normalize.
   * @throws {TypeError} if `path` is not a string.
   */
  normalize: (path: string) => string

  /**
   * Join all arguments together and normalize the resulting path.
   *
   * @param paths paths to join.
   * @throws {TypeError} if any of the path segments is not a string.
   */
  join: (...args: string[]) => string

  /**
   * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
   * until an absolute path is found. If after using all {from} paths still no absolute path is found,
   * the current working directory is used as well. The resulting path is normalized,
   * and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param paths A sequence of paths or path segments.
   * @throws {TypeError} if any of the arguments is not a string.
   */
  resolve: (...args: string[]) => string

  /**
   * The `path.matchesGlob()` method determines if `path` matches the `pattern`.
   * @param path The path to glob-match against.
   * @param pattern The glob to check the path against.
   * @returns Whether or not the `path` matched the `pattern`.
   * @throws {TypeError} if `path` or `pattern` are not strings.
   * @since v22.5.0
   */
  matchesGlob(path: string, pattern: string): boolean

  /**
   * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
   *
   * If the given {path} is a zero-length string, `false` will be returned.
   *
   * @param path path to test.
   * @throws {TypeError} if `path` is not a string.
   */
  isAbsolute: (path: string) => boolean

  /**
   * Solve the relative path from {from} to {to} based on the current working directory.
   * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
   *
   * @throws {TypeError} if either `from` or `to` is not a string.
   */
  relative: (from: string, to: string) => string

  /**
   * Return the directory name of a path. Similar to the Unix dirname command.
   *
   * @param path the path to evaluate.
   * @throws {TypeError} if `path` is not a string.
   */
  dirname: (path: string) => string

  /**
   * Return the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   *
   * @param path the path to evaluate.
   * @param suffix optionally, an extension to remove from the result.
   * @throws {TypeError} if `path` is not a string or if `ext` is given and is not a string.
   */
  basename: (path: string, ext?: string) => string

  /**
   * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
   * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
   *
   * @param path the path to evaluate.
   * @throws {TypeError} if `path` is not a string.
   */
  extname: (path: string) => string

  /**
   * The platform-specific file separator. '\\' or '/'.
   */
  sep: string

  /**
   * The platform-specific file delimiter. ';' or ':'.
   */
  delimiter: string

  /**
   * Returns an object from a path string - the opposite of format().
   *
   * @param path path to evaluate.
   * @throws {TypeError} if `path` is not a string.
   */
  parse: (path: string) => ParsedPath

  /**
   * Returns a path string from an object - the opposite of parse().
   *
   * @param pathObject path to evaluate.
   */
  format: (pathInfo: FormatInputPathObject) => string

  /**
   * On Windows systems only, returns an equivalent namespace-prefixed path for the given path.
   * If path is not a string, path will be returned without modifications.
   * This method is meaningful only on Windows system.
   * On POSIX systems, the method is non-operational and always returns path without modifications.
   */
  toNamespacedPath(path: string): string

  /**
   * The `path.posix` property provides access to POSIX specific implementations of the `path` methods.
   *
   * The API is accessible via `require('node:path').posix` or `require('node:path/posix')`.
   */
  posix: Omit<PathImpl, 'posix' | 'win32'>

  /**
   * The `path.win32` property provides access to Windows-specific implementations of the `path` methods.
   *
   * The API is accessible via `require('node:path').win32` or `require('node:path/win32')`.
   */
  win32: Omit<PathImpl, 'posix' | 'win32'>
}


const WINDOWS_SEPARATOR = '\\'
const LINUX_SEPARATOR = '/'

const WINDOWS_DELIMITER = ';'
const LINUX_DELIMITER = ':'

const WINDOWS_ROOT_REGEX = /^[a-zA-Z]:\\/
const LINUX_ROOT_REGEX = /^\//


function assertPathIsString(path: string): void {
  if (typeof path !== 'string') {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path)}`,
    )
  }
}

function assertPathsAreStrings(paths: string[]): void {
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]

    if (typeof path !== 'string') {
      throw new TypeError(
        `Path must be a string. Received ${JSON.stringify(path)} at index ${i}`,
      )
    }
  }
}

function assertFormatInputPathObject(
  formatInputPathObject: unknown,
): asserts formatInputPathObject is FormatInputPathObject {
  const isNull = formatInputPathObject === null
  const isObject = typeof formatInputPathObject === 'object'
  const isJsonObject = Object.getPrototypeOf(formatInputPathObject) === Object.prototype
  if (isNull || !isObject || !isJsonObject) {
    throw new TypeError('formatInputPathObject must be a string')
  }

  const {
    root,
    dir,
    base,
    ext,
    name,
  } = formatInputPathObject as FormatInputPathObject

  if (root !== undefined && typeof root !== 'string') {
    throw new TypeError('root must be undefined or string')
  }
  if (dir !== undefined && typeof dir !== 'string') {
    throw new TypeError('dir must be undefined or string')
  }
  if (base !== undefined && typeof base !== 'string') {
    throw new TypeError('base must be undefined or string')
  }
  if (ext !== undefined && typeof ext !== 'string') {
    throw new TypeError('ext must be undefined or string')
  }
  if (name !== undefined && typeof name !== 'string') {
    throw new TypeError('name must be undefined or string')
  }
}


function isAbsoluteGeneric(path: string, regex: RegExp): boolean {
  assertPathIsString(path)

  return regex.test(path)
}


function createPathImplementation(params: {
  sep: string
  delimiter: string
  isAbsolute: (path: string) => boolean
}): Omit<PathImpl, 'posix' | 'win32'> {
  const { sep, delimiter, isAbsolute } = params


  const ONE_OR_MORE_SEPARATORS = new RegExp(`${sep}+`, 'g')


  function normalize(path: string): string {
    assertPathIsString(path)

    if (!path.length) {
      return '.'
    }

    const components: string[] = []

    const pathWithNormalizedSeparators = path.replace(
      ONE_OR_MORE_SEPARATORS,
      sep,
    )
    const pathParts = pathWithNormalizedSeparators.split(sep)

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i]

      if (part === '.' || part === '') {
        continue
      }

      if (part === '..') {
        const lastComponent = components.at(-1)
        if (lastComponent === undefined || lastComponent === '..') {
          components.push(part)
        } else {
          components.pop()
        }
        continue
      }

      components.push(part)
    }

    return pathParts.join(sep)
  }


  function join(...paths: string[]): string {
    assertPathsAreStrings(paths)

    const joinedPath = paths
      .filter(path => !!path)
      .join(sep)

    return normalize(joinedPath)
  }


  function resolve(...paths: string[]): string {
    assertPathsAreStrings(paths)

    let resolved = ''
    for (let i = paths.length - 1; i >= 0; i--) {
      const path = paths[i]

      if (isAbsolute(path)) {
        resolved = path
        continue
      }

      const prefix = resolved.length > 0 && !resolved.endsWith(sep)
        ? sep
        : ''

      resolved = path + prefix + resolved
    }
    return resolved
  }


  function matchesGlob(path: string, pattern: string): boolean {
    assertPathIsString(path)
    assertPathIsString(pattern)

    const regexStr = path
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')

    const regex = new RegExp(`^${regexStr}$`)
    return regex.test(pattern)
  }


  function relative(from: string, to: string): string {
    assertPathIsString(from)
    assertPathIsString(to)

    const fromSegments = from.split(sep).filter(segment => !!segment)
    const toSegments = to.split(sep).filter(segment => !!segment)

    let commonIndex = 0
    while (
      commonIndex < fromSegments.length
      && commonIndex < toSegments.length
      && fromSegments[commonIndex] === toSegments[commonIndex]
    ) {
      commonIndex++
    }

    const upCount = fromSegments.length - commonIndex
    const upSegments = Array(upCount).fill('..')
    const remainingTo = toSegments.slice(commonIndex)

    const result = [...upSegments, ...remainingTo].join(sep)
    return result.length ? result : '.'
  }


  function dirname(path: string): string {
    assertPathIsString(path)

    return normalize(path)
      .split(sep)
      .slice(0, -1)
      .join(sep)
  }


  function basename(path: string, suffix?: string): string {
    assertPathIsString(path)
    if (suffix !== undefined) {
      assertPathIsString(suffix)
    }

    const pathParts = normalize(path).split(sep)
    const baseName = pathParts.at(-1) ?? ''

    if (suffix) {
      const hasSuffix = baseName.endsWith(suffix)
      if (!hasSuffix) {
        return baseName
      }
      return baseName.slice(0, -suffix.length)
    }

    return baseName
  }


  function extname(path: string): string {
    assertPathIsString(path)

    const baseName = basename(path)

    const startsWithDot = baseName.startsWith('.')
    const hasDot = baseName.includes('.')
    if (startsWithDot || !hasDot) {
      return ''
    }

    const lastIndexOfDot = baseName.lastIndexOf('.')
    const extension = baseName.slice(lastIndexOfDot)
    return extension
  }


  function parse(path: string): ParsedPath {
    const root = path.startsWith(sep) ? sep : ''
    const dir = dirname(path)
    const base = basename(path)
    const ext = extname(path)
    const name = basename(path, ext)
    return { root, dir, base, ext, name }
  }


  function format(pathObject: FormatInputPathObject): string {
    assertFormatInputPathObject(pathObject)

    const { root, dir, base } = pathObject
    const path = [root, dir, base].join(sep)
    return normalize(path)
  }


  function toNamespacedPath(path: string): string {
    return path
  }


  return {
    normalize,
    join,
    resolve,
    matchesGlob,
    isAbsolute,
    relative,
    dirname,
    basename,
    extname,
    sep,
    delimiter,
    parse,
    format,
    toNamespacedPath,
  }
}


const posixPathPolyfill = createPathImplementation({
  sep: LINUX_SEPARATOR,
  delimiter: LINUX_DELIMITER,
  isAbsolute: (path: string) => isAbsoluteGeneric(path, LINUX_ROOT_REGEX),
})

const win32PathPolyfill = createPathImplementation({
  sep: WINDOWS_SEPARATOR,
  delimiter: WINDOWS_DELIMITER,
  isAbsolute: (path: string) => isAbsoluteGeneric(path, WINDOWS_ROOT_REGEX),
})


export default {
  ...posixPathPolyfill,
  posix: posixPathPolyfill,
  win32: win32PathPolyfill,
} satisfies PathImpl
