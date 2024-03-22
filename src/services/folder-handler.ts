import RNFS from "react-native-fs"

import { Constants } from "./constant"
import { log, stringfyError } from "./log"
import { getWritePermission } from "./permission"


export async function createAllFolders() {
  const hasWritePermission = await getWritePermission()
  if (!hasWritePermission) {
    log.warn("Can't create all folders without write external storage permission")
    return
  }

  try {
    await RNFS.mkdir(Constants.fullPathExported)
    await RNFS.mkdir(Constants.fullPathPdf)
    await RNFS.mkdir(Constants.fullPathPicture)
    await RNFS.mkdir(Constants.fullPathTemporaryExported)
    await RNFS.mkdir(Constants.fullPathTemporaryImported)
    await RNFS.mkdir(Constants.fullPathTemporaryCompressedPicture)
  } catch (error) {
    log.error(`Error creating all folders: ${stringfyError(error)}`)
  }
}
