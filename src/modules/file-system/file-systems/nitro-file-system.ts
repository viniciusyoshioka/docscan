import { Buffer } from 'react-native-nitro-buffer'
import type { RmOptions } from 'react-native-nitro-file-system'
import fs from 'react-native-nitro-file-system'
import { v4 as uuidV4 } from 'uuid'

import { Info } from '@modules/info'
import { normalizeError } from '@utils'
import {
  BaseFileSystemError,
  InvalidParamError,
  InvalidPathTypeError,
  PathAlreadyExistsError,
  PathNotExistsError,
  UnexpectedFileSystemError,
} from '../errors'
import { FileSystem } from '../file-system.base.ts'
import type { FileStat, ReadChunkFileOptions } from '../file-system.types.ts'
import { FileEncoding } from '../file-system.types.ts'
import type { RelativePath } from '../paths'
import { AbsolutePath, PathType } from '../paths'


export class NitroFileSystem extends FileSystem {


  override async exists(
    path: AbsolutePath | RelativePath,
  ): Promise<boolean> {
    this.assertPathIsAbsolutePathInstance(path)

    try {
      await fs.promises.access(path.absolutePath, fs.constants.F_OK)
      return true
    } catch (error) {
      return false
    }
  }

  override async fileStat(
    path: AbsolutePath | RelativePath,
  ): Promise<FileStat> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot get path stat because it does not exists',
      )
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot get path stat because its not a file',
      )
    }

    try {
      const stat = await fs.promises.stat(path.absolutePath)

      return {
        sizeInBytes: stat.size,
        createdAt: stat.ctime,
        modifiedAt: stat.mtime,
        accessedAt: stat.atime,
      }
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async resolvePathType(
    path: AbsolutePath | RelativePath,
    resolveEvenWhenDefined = false,
  ): Promise<PathType> {
    this.assertPathIsAbsolutePathInstance(path)

    const isPathTypeDefined = this.isPathTypeDefined(path)
    if (isPathTypeDefined && !resolveEvenWhenDefined) {
      return path.type
    }

    const pathExists = await this.exists(path)
    if (!pathExists) {
      path.updateType(PathType.NULL)
      return PathType.NULL
    }

    try {
      const lStats = await fs.promises.lstat(path.absolutePath)
      if (lStats.isFile()) {
        path.updateType(PathType.FILE)
        return PathType.FILE
      }
      if (lStats.isDirectory()) {
        path.updateType(PathType.FOLDER)
        return PathType.FOLDER
      }

      if (lStats.isSymbolicLink()) {
        const stats = await fs.promises.stat(path.absolutePath)
        if (stats.isFile()) {
          path.updateType(PathType.SYMLINK_FILE)
          return PathType.SYMLINK_FILE
        }
        if (stats.isDirectory()) {
          path.updateType(PathType.SYMLINK_FOLDER)
          return PathType.SYMLINK_FOLDER
        }
        path.updateType(PathType.SYMLINK_OTHER)
        return PathType.SYMLINK_OTHER
      }

      path.updateType(PathType.OTHER)
      return PathType.OTHER
    } catch (error) {
      path.updateType(PathType.NULL)
      return PathType.NULL
    }
  }


  override async readFile(
    path: AbsolutePath | RelativePath,
    encoding = FileEncoding.UTF_8,
  ): Promise<string | Buffer> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot read path because it does not exists',
      )
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot read path because its not a file',
      )
    }

    try {
      const data = await fs.promises.readFile(
        path.absolutePath,
        { encoding },
      )

      return this.convertDataToEncoding(data, encoding)
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async *readChunkFile(
    path: AbsolutePath | RelativePath,
    options?: ReadChunkFileOptions,
  ): AsyncGenerator<string | Buffer> {
    const {
      startByte = 0,
      endByte = null,
      // 1 MB
      chunkSizeInBytes = 1024 * 1024 * 1,
      encoding = FileEncoding.UTF_8,
    } = options ?? {}

    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot read path because it does not exists',
      )
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot read path because its not a file',
      )
    }

    const fileStat = await this.fileStat(path)
    const endByteWithFallback = endByte ?? fileStat.sizeInBytes
    if (startByte >= endByteWithFallback) {
      throw new InvalidParamError(
        'start byte cannot be greater than or equal to end byte',
      )
    }

    let fd: number | null = null
    try {
      fd = fs.openSync(path.absolutePath)
      const buffer = new Buffer(chunkSizeInBytes)

      for (let i = startByte; i < endByteWithFallback; i += chunkSizeInBytes) {
        await fs.promises.read(
          fd,
          buffer,
          0,
          chunkSizeInBytes,
          null,
        )

        yield this.convertDataToEncoding(buffer, encoding)
      }

      fs.closeSync(fd)
    } catch (error) {
      if (fd) {
        fs.closeSync(fd)
      }
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async writeFile(
    path: AbsolutePath | RelativePath,
    data: string | Buffer,
    encoding = FileEncoding.UTF_8,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (pathExists) {
      throw new PathAlreadyExistsError(
        'Cannot write file because path already exists',
      )
    }

    try {
      await fs.promises.writeFile(
        path.absolutePath,
        data,
        {
          encoding,
        },
      )
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async appendFile(
    path: AbsolutePath | RelativePath,
    data: string | Buffer,
    encoding = FileEncoding.UTF_8,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot append to file because path does not exists',
      )
    }

    try {
      await fs.promises.appendFile(
        path.absolutePath,
        data,
        {
          encoding,
        },
      )
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async moveFile(
    sourcePath: AbsolutePath | RelativePath,
    destinationPath: AbsolutePath | RelativePath,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(sourcePath)
    this.assertPathIsAbsolutePathInstance(destinationPath)

    const sourcePathExists = await this.exists(sourcePath)
    if (!sourcePathExists) {
      throw new PathNotExistsError(
        'Cannot move file from sourcePath to destinationPath because sourcePath does not exists',
      )
    }

    await this.resolvePathType(sourcePath)
    if (sourcePath.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot move sourcePath because it is not a file',
      )
    }

    const destinationPathExists = await this.exists(destinationPath)
    if (destinationPathExists) {
      await this.delete(destinationPath)
    }

    const parentPath = new AbsolutePath(destinationPath.parentAbsolutePath)
    const parentPathExists = await this.exists(parentPath)
    if (!parentPathExists) {
      await this.createFolder(parentPath)
    }

    try {
      await fs.promises.rename(
        sourcePath.absolutePath,
        destinationPath.absolutePath,
      )
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async copyFile(
    sourcePath: AbsolutePath | RelativePath,
    destinationPath: AbsolutePath | RelativePath,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(sourcePath)
    this.assertPathIsAbsolutePathInstance(destinationPath)

    const sourcePathExists = await this.exists(sourcePath)
    if (!sourcePathExists) {
      throw new PathNotExistsError(
        'Cannot copy file from sourcePath to destinationPath because sourcePath does not exists',
      )
    }

    await this.resolvePathType(sourcePath)
    if (sourcePath.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot copy sourcePath because it is not a file',
      )
    }

    const destinationPathExists = await this.exists(destinationPath)
    if (destinationPathExists) {
      await this.delete(destinationPath)
    }

    const parentPath = new AbsolutePath(destinationPath.parentAbsolutePath)
    const parentPathExists = await this.exists(parentPath)
    if (!parentPathExists) {
      await this.createFolder(parentPath)
    }

    try {
      await fs.promises.copyFile(
        sourcePath.absolutePath,
        destinationPath.absolutePath,
      )
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async deleteFile(
    path: AbsolutePath | RelativePath,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot delete file because it does not exists',
      )
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FILE) {
      throw new InvalidPathTypeError(
        'Cannot delete path because it is not a file',
      )
    }

    const rmOptions: RmOptions = {
      force: true,
      recursive: true,
    }

    try {
      await fs.promises.rm(path.absolutePath, rmOptions)
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }


  override async readFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<string[] | null> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      return []
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FOLDER) {
      return null
    }

    try {
      return await fs.promises.readdir(path.absolutePath)
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async createFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (pathExists) {
      throw new PathNotExistsError(
        'Cannot create directory because path already exists',
      )
    }

    try {
      await fs.promises.mkdir(path.absolutePath)
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }

  override async deleteFolder(
    path: AbsolutePath | RelativePath,
  ): Promise<void> {
    this.assertPathIsAbsolutePathInstance(path)

    const pathExists = await this.exists(path)
    if (!pathExists) {
      throw new PathNotExistsError(
        'Cannot delete folder because it does not exists',
      )
    }

    await this.resolvePathType(path)
    if (path.type !== PathType.FOLDER) {
      throw new InvalidPathTypeError(
        'Cannot delete path because it is not a folder',
      )
    }

    const rmOptions: RmOptions = {
      force: true,
      recursive: true,
    }

    try {
      await fs.promises.rm(path.absolutePath, rmOptions)
    } catch (error) {
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }


  private async delete(path: AbsolutePath | RelativePath): Promise<void> {
    await this.resolvePathType(path)

    if (path.type === PathType.FILE) {
      await this.deleteFile(path)
      return
    }

    if (path.type === PathType.FOLDER) {
      await this.deleteFolder(path)
      return
    }

    throw new InvalidPathTypeError(
      `Unexpected path type "${path.type}" to delete`,
    )
  }


  private convertDataToEncoding(
    data: string | Buffer,
    encoding: FileEncoding,
  ): string | Buffer {
    if (typeof data === 'string') {
      switch (encoding) {
        case FileEncoding.BASE64:
        case FileEncoding.UTF_8:
          return data
        case FileEncoding.BUFFER:
          return Buffer.from(data)
        default:
          encoding satisfies never
          throw new InvalidParamError(`Invalid encoding ${String(encoding)}`)
      }
    }

    switch (encoding) {
      case FileEncoding.BASE64:
        return data.toString('base64')
      case FileEncoding.UTF_8:
        return data.toString('utf8')
      case FileEncoding.BUFFER:
        return data
      default:
        encoding satisfies never
        throw new InvalidParamError(`Invalid encoding ${String(encoding)}`)
    }
  }


  async copyUriToApp(
    uri: string,
    extension?: string | null,
  ): Promise<AbsolutePath> {
    const parentFolderPath = new AbsolutePath(Info.folders.internal.temp)

    const copiedFileName = extension
      ? `${uuidV4()}.${extension}`
      : uuidV4()
    const copiedFilePath = new AbsolutePath([
      parentFolderPath.absolutePath,
      copiedFileName,
    ])

    let fd: number | null = null
    try {
      const fileStat = await fs.promises.stat(uri)

      const startByte = 0
      const endByte = fileStat.size
      // 1 MB
      const chunkSizeInBytes = 1024 * 1024 * 1
      const encoding = FileEncoding.BASE64

      await this.createFolder(parentFolderPath)

      fd = fs.openSync(uri)
      const buffer = new Buffer(chunkSizeInBytes)

      for (let i = startByte; i < endByte; i += chunkSizeInBytes) {
        await fs.promises.read(
          fd,
          buffer,
          0,
          chunkSizeInBytes,
          null,
        )

        await fs.promises.appendFile(
          copiedFilePath.absolutePath,
          buffer,
          { encoding },
        )
      }

      fs.closeSync(fd)

      return copiedFilePath
    } catch (error) {
      if (fd) {
        fs.closeSync(fd)
      }
      if (error instanceof BaseFileSystemError) {
        throw error
      }
      const errorInstance = normalizeError(error)
      throw new UnexpectedFileSystemError(errorInstance.message)
    }
  }
}
