import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPictureOriginal, fullPathPictureCropped, fullPathRootExternal } from "./constant"
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

async function createRootFolderExternal() {
    try {
        if (!await RNFS.exists(fullPathRootExternal)) {
            await RNFS.mkdir(fullPathRootExternal)
        }
    } catch (error) {
        log("ERROR", `folder-handler createRootFolderExternal - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

async function createPdfFolderExternal() {
    try {
        if (!await RNFS.exists(fullPathPdf)) {
            await RNFS.mkdir(fullPathPdf)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
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
    // createRootFolderExternal()
    createPdfFolderExternal()
    createPictureOriginalFolder()
    createPictureCroppedFolder()
}
