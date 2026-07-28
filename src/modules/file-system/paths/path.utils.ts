import { NotAbsolutePathError } from '../errors'
import { AbsolutePath } from './absolute-path.ts'


export class PathUtils {
  static withFileProtocol(path: string | AbsolutePath): string {
    if (path instanceof AbsolutePath) {
      return `file://${path.absolutePath}`
    }

    const isAbsolute = AbsolutePath.isAbsolute(path)
    if (!isAbsolute) {
      throw new NotAbsolutePathError(
        'Cannot add file protocol to a relative path',
      )
    }

    return `file://${path}`
  }

  static removeFileProtocol(path: string | AbsolutePath): string {
    const fileProtocolPrefixRegex = /^file:\/\//

    if (path instanceof AbsolutePath) {
      return path.absolutePath.replace(fileProtocolPrefixRegex, '')
    }

    return path.replace(fileProtocolPrefixRegex, '')
  }
}
