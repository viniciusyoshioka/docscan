import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathPictureOriginal, fullPathPictureCropped } from "./constant"
import { log } from "./log"


async function createRootFolder() {
    try {
        if (!await RNFS.exists(fullPathRoot)) {
            await RNFS.mkdir(fullPathRoot)
        }
    } catch (error) {
        log("ERROR", `folder-handler createRootFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

async function createPdfFolder() {
    try {
        if (!await RNFS.exists(fullPathPdf)) {
            await RNFS.mkdir(fullPathPdf)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

async function createPictureFolder() {
    try {
        if (!await RNFS.exists(fullPathPicture)) {
            await RNFS.mkdir(fullPathPicture)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

async function createPictureOriginalFolder() {
    try {
        if (!await RNFS.exists(fullPathPictureOriginal)) {
            await RNFS.mkdir(fullPathPictureOriginal)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPictureOriginalFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

async function createPictureCroppedFolder() {
    try {
        if (!await RNFS.exists(fullPathPictureCropped)) {
            await RNFS.mkdir(fullPathPictureCropped)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPictureCroppedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export function createAllFolder() {
    // createRootFolder()
    createPdfFolder()
    // createPictureFolder()
    createPictureOriginalFolder()
    createPictureCroppedFolder()
}
