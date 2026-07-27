import type { Buffer } from 'react-native-nitro-buffer'

import { NotAbsolutePathError, NotRelativePathError } from './errors'
import type {
  FileEncoding,
  FileStat,
  ReadChunkFileOptions,
} from './file-system.types.ts'
import type { PathType } from './paths'
import { AbsolutePath, NOT_DEFINED_PATH_TYPES, RelativePath } from './paths'


export abstract class FileSystem {


  protected assertPathIsAbsolutePathInstance(
    path: AbsolutePath | RelativePath,
  ): asserts path is AbsolutePath {
    const isAbsolute = path instanceof AbsolutePath
    if (!isAbsolute) {
      throw new NotAbsolutePathError('Path is not an AbsolutePath instance')
    }
  }

  protected assertPathIsRelativePathInstance(
    path: AbsolutePath | RelativePath,
  ): asserts path is RelativePath {
    const isRelative = path instanceof RelativePath
    if (!isRelative) {
      throw new NotRelativePathError('Path is not an RelativePath instance')
    }
  }

  protected isPathTypeDefined(path: AbsolutePath | RelativePath): boolean {
    const isPathTypeNotDefined = NOT_DEFINED_PATH_TYPES.includes(path.type)
    return !isPathTypeNotDefined
  }


  abstract exists(path: AbsolutePath | RelativePath): Promise<boolean>

  abstract fileStat(path: AbsolutePath | RelativePath): Promise<FileStat>

  abstract resolvePathType(
    path: AbsolutePath | RelativePath,
    resolveEvenWhenDefined?: boolean
  ): Promise<PathType>


  abstract readFile(
    path: AbsolutePath | RelativePath,
    encoding?: FileEncoding,
  ): Promise<string | Buffer>

  abstract readChunkFile(
    path: AbsolutePath | RelativePath,
    options: ReadChunkFileOptions,
  ): AsyncGenerator<string | Buffer>

  abstract writeFile(
    path: AbsolutePath | RelativePath,
    data: string | Buffer,
    encoding?: FileEncoding,
  ): Promise<void>

  abstract appendFile(
    path: AbsolutePath | RelativePath,
    data: string | Buffer,
    encoding?: FileEncoding,
  ): Promise<void>

  abstract moveFile(
    sourcePath: AbsolutePath | RelativePath,
    destinationPath: AbsolutePath | RelativePath,
  ): Promise<void>

  abstract copyFile(
    sourcePath: AbsolutePath | RelativePath,
    destinationPath: AbsolutePath | RelativePath,
  ): Promise<void>

  abstract deleteFile(
    path: AbsolutePath | RelativePath,
  ): Promise<void>


  abstract readFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<string[] | null>

  abstract createFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<void>

  // abstract moveFolder(
  //   sourcePath: AbsolutePath | RelativePath,
  //   destinationPath: AbsolutePath | RelativePath,
  // ): Promise<void>

  // abstract copyFolder(
  //   sourcePath: AbsolutePath | RelativePath,
  //   destinationPath: AbsolutePath | RelativePath,
  // ): Promise<void>

  abstract deleteFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<void>
}
