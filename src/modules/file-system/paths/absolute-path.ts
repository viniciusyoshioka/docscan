import path from 'node:path'

import { NotAbsolutePathError } from '../errors'
import { PathType } from './path.types.ts'


export class AbsolutePath {


  readonly absolutePath: string
  readonly parentAbsolutePath: string
  readonly baseName: string
  readonly fileExtension: string | null

  private _type = PathType.UNKNOWN


  constructor(pathOrPathParts: string | string[]) {
    const joinedPath = AbsolutePath.join(pathOrPathParts)
    AbsolutePath.assertPathIsAbsolute(joinedPath)

    this.absolutePath = joinedPath
    this.parentAbsolutePath = AbsolutePath.getParentPathAsAbsolutePath(
      this.absolutePath,
    )
    this.baseName = AbsolutePath.getBaseName(
      this.absolutePath,
    )
    this.fileExtension = AbsolutePath.getFileExtension(
      this.absolutePath,
    )
  }


  get type(): PathType {
    return this._type
  }

  updateType(type: PathType): void {
    this._type = type
  }


  static normalize(pathToNormalize: string): string {
    return path.normalize(pathToNormalize)
  }

  static join(pathOrPathParts: string | string[]): string {
    if (Array.isArray(pathOrPathParts)) {
      return path.join(...pathOrPathParts)
    }
    return AbsolutePath.normalize(pathOrPathParts)
  }

  static isAbsolute(pathToCheck: string): boolean {
    return path.isAbsolute(pathToCheck)
  }

  private static assertPathIsAbsolute(
    pathToCheck: string,
    customErrorMessage?: string,
  ): void {
    const pathIsAbsolute = AbsolutePath.isAbsolute(pathToCheck)
    if (!pathIsAbsolute) {
      const errorMessage = customErrorMessage ?? 'Path must be absolute'
      throw new NotAbsolutePathError(errorMessage)
    }
  }

  static getParentPathAsAbsolutePath(absolutePath: string): string {
    AbsolutePath.assertPathIsAbsolute(absolutePath)
    return path.dirname(absolutePath)
  }

  static getBaseName(absolutePath: string): string {
    AbsolutePath.assertPathIsAbsolute(absolutePath)
    return path.basename(absolutePath)
  }

  static getFileExtension(absolutePath: string): string | null {
    AbsolutePath.assertPathIsAbsolute(absolutePath)
    const extension = path.extname(absolutePath)
    return extension.length ? extension : null
  }

  /**
   * Solve the relative path from `fromPath` to `toPath` based on
   * the current working directory.
   *
   * @example
   * const pathA = '/path/to/a/file'
   * const pathB = '/path/to/a/file/in/somewhere'
   * getRelativePathBetweenPaths(pathA, pathB) // './in/somewhere'
   */
  static getRelativePathBetweenPaths(fromPath: string, toPath: string): string {
    AbsolutePath.assertPathIsAbsolute(fromPath, 'From path must be absolute')
    AbsolutePath.assertPathIsAbsolute(toPath, 'To path must be absolute')
    return path.relative(fromPath, toPath)
  }

  static isPathSubPathOfBasePath(basePath: string, subPath: string): boolean {
    AbsolutePath.assertPathIsAbsolute(basePath, 'Base path must be absolute')
    AbsolutePath.assertPathIsAbsolute(subPath, 'Subpath must be absolute')

    const possibleSeparatorsAtEndOfPathRegex = /(\\|\/)+$/

    const normalizedBasePath = basePath.replace(
      possibleSeparatorsAtEndOfPathRegex,
      '',
    )
    const normalizedSubPath = subPath.replace(
      possibleSeparatorsAtEndOfPathRegex,
      '',
    )

    return normalizedSubPath.startsWith(normalizedBasePath)
  }


  isSubPathOf(rootPath: AbsolutePath): boolean {
    return AbsolutePath.isPathSubPathOfBasePath(
      rootPath.absolutePath,
      this.absolutePath,
    )
  }

  getRelativePathToRoot(rootPath: string): string {
    return AbsolutePath.getRelativePathBetweenPaths(
      rootPath,
      this.absolutePath,
    )
  }
}
