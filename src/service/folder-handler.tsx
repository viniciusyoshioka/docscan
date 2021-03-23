import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathPictureOriginal, fullPathPictureCropped } from "./constant"


export async function createRootFolder() {
    if (!(await RNFS.exists(fullPathRoot))) {
        RNFS.mkdir(fullPathRoot)
    }
}

export async function createPdfFolder() {
    if (!(await RNFS.exists(fullPathPdf))) {
        RNFS.mkdir(fullPathPdf)
    }
}

export async function createPictureFolder() {
    if (!(await RNFS.exists(fullPathPicture))) {
        RNFS.mkdir(fullPathPicture)
    }
}

export async function createPictureOriginalFolder() {
    if (!(await RNFS.exists(fullPathPictureOriginal))) {
        RNFS.mkdir(fullPathPictureOriginal)
    }
}

export async function createPictureCroppedFolder() {
    if (!(await RNFS.exists(fullPathPictureCropped))) {
        RNFS.mkdir(fullPathPictureCropped)
    }
}

export async function createAllFolder() {
    // await createRootFolder()
    await createPdfFolder()
    // await createPictureFolder()
    await createPictureOriginalFolder()
    await createPictureCroppedFolder()
}
