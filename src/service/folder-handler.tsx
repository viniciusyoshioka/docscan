import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathPictureOriginal, fullPathPictureCropped } from "./constant"


async function createRootFolder() {
    try {
        if (!(await RNFS.exists(fullPathRoot))) {
            await RNFS.mkdir(fullPathRoot)
        }
    } catch (error) {
        console.log(error)
    }
}

async function createPdfFolder() {
    try {
        if (!(await RNFS.exists(fullPathPdf))) {
            await RNFS.mkdir(fullPathPdf)
        }
    } catch (error) {
        console.log(error)
    }
}

async function createPictureFolder() {
    try {
        if (!(await RNFS.exists(fullPathPicture))) {
            await RNFS.mkdir(fullPathPicture)
        }
    } catch (error) {
        console.log(error)
    }
}

async function createPictureOriginalFolder() {
    try {
        if (!(await RNFS.exists(fullPathPictureOriginal))) {
            await RNFS.mkdir(fullPathPictureOriginal)
        }
    } catch (error) {
        console.log(error)
    }
}

async function createPictureCroppedFolder() {
    try {
        if (!(await RNFS.exists(fullPathPictureCropped))) {
            await RNFS.mkdir(fullPathPictureCropped)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function createAllFolder() {
    // await createRootFolder()
    await createPdfFolder()
    // await createPictureFolder()
    await createPictureOriginalFolder()
    await createPictureCroppedFolder()
}
