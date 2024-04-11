import RNFS from "react-native-fs"

import { Constants } from "./constant"
import { getWritePermission } from "./permission"


export async function createAllFolders() {
  const hasWritePermission = await getWritePermission()
  if (!hasWritePermission) {
    throw new Error("No write permission")
  }

  await RNFS.mkdir(Constants.fullPathExported)
  await RNFS.mkdir(Constants.fullPathPdf)
  await RNFS.mkdir(Constants.fullPathPicture)
  await RNFS.mkdir(Constants.fullPathTemporaryExported)
  await RNFS.mkdir(Constants.fullPathTemporaryImported)
  await RNFS.mkdir(Constants.fullPathTemporaryCompressedPicture)
}
