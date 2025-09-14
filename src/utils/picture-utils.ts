import RNFS from "react-native-fs"
import { v4 as uuid4 } from "uuid"

import { Constants } from "@services/constant"
import { PathUtils } from "./path-utils"


export class PictureUtils {
  static getPicturePathForFileName(fileName: string): string {
    return PathUtils.joinPaths(Constants.fullPathPicture, fileName)
  }

  static async getNewPicturePathWithSameExtension(filePath: string): Promise<string> {
    const extension = PathUtils.getExtensionFromPath(filePath) ?? ""

    let count = 0
    const limit = 3

    while (true) {
      if (count === limit) {
        throw new Error("Max limit reached to get a new picture path")
      }

      const fileName = uuid4()
      const fullFileName = PathUtils.joinFileNames(fileName, extension)
      const newPicturePath = PathUtils.joinPaths(Constants.fullPathPicture, fullFileName)

      const pathExists = await RNFS.exists(newPicturePath)
      if (pathExists) {
        count++
        continue
      }
      return newPicturePath
    }
  }
}
