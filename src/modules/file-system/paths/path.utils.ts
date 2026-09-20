import { NotAbsolutePathError } from '../errors'
import { AbsolutePath } from './absolute-path.ts'


export class PathUtils {


  private static readonly FILE_PROTOCOL = 'file://'


  static withFileProtocol(path: string | AbsolutePath): string {
    if (path instanceof AbsolutePath) {
      return `${PathUtils.FILE_PROTOCOL}${path.absolutePath}`
    }

    const isAbsolute = AbsolutePath.isAbsolute(path)
    if (!isAbsolute) {
      throw new NotAbsolutePathError(
        'Cannot add file protocol to a relative path',
      )
    }

    const hasFileProtocol = path.startsWith(PathUtils.FILE_PROTOCOL)
    if (hasFileProtocol) {
      return path
    }
    return `${PathUtils.FILE_PROTOCOL}${path}`
  }

  static removeFileProtocol(path: string | AbsolutePath): string {
    const fileProtocolPrefixRegex = /^file:\/\//

    if (path instanceof AbsolutePath) {
      return path.absolutePath.replace(fileProtocolPrefixRegex, '')
    }

    return path.replace(fileProtocolPrefixRegex, '')
  }
}
