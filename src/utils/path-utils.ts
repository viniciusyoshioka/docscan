export class PathUtils {


  private static readonly separator = "/"
  private static readonly dot = "."


  static getFileNameFromPath(path: string): string {
    const splittedPath = path.split(this.separator)
    return splittedPath[splittedPath.length - 1]
  }

  static getExtensionFromPath(path: string): string | null {
    const fileName = this.getFileNameFromPath(path)
    if (!fileName) {
      return null
    }

    const hasDot = fileName.includes(this.dot)
    if (!hasDot) {
      return null
    }

    const startsWithDot = fileName.startsWith(this.dot)
    const hasDotAfterTheInitialDot = fileName.substring(1).includes(this.dot)
    if (startsWithDot && !hasDotAfterTheInitialDot) {
      return null
    }

    const splittedFileName = fileName.split(this.dot)
    return splittedFileName[splittedFileName.length - 1]
  }

  static joinPaths(...paths: string[]): string {
    return paths.join(this.separator)
  }

  static joinFileNames(...fileNames: string[]): string {
    return fileNames.join(this.dot)
  }

  static fullPathToFileProtocol(fullPath: string): string {
    return `file://${fullPath}`
  }
}
