import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathRootExternal, fullPathExported, fullPathTemporary, fullPathTemporaryExported, fullPathTemporaryCompressedPicture } from "./constant"
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

async function createPdfFolder() {
    try {
        if (!await RNFS.exists(fullPathPdf)) {
            await RNFS.mkdir(fullPathPdf)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export async function createExportedFolder() {
    try {
        if (!await RNFS.exists(fullPathExported)) {
            await RNFS.mkdir(fullPathExported)
        }
    } catch (error) {
        log("ERROR", `folder-handler createExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export async function createPictureFolder() {
    try {
        if (!await RNFS.exists(fullPathPicture)) {
            await RNFS.mkdir(fullPathPicture)
        }
    } catch (error) {
        log("ERROR", `folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export async function createTemporaryFolder() {
    try {
        if (!await RNFS.exists(fullPathTemporary)) {
            await RNFS.mkdir(fullPathTemporary)
        }
    } catch (error) {
        log("ERROR", `folder-handler createTemporaryFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export async function createTemporaryExportedFolder() {
    try {
        if (!await RNFS.exists(fullPathTemporaryExported)) {
            await RNFS.mkdir(fullPathTemporaryExported)
        }
    } catch (error) {
        log("ERROR", `folder-handler createTemporaryExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}

export async function createTemporaryCompressedPictureFolder() {
    try {
        if (!await RNFS.exists(fullPathTemporaryCompressedPicture)) {
            await RNFS.mkdir(fullPathTemporaryCompressedPicture)
        }
    } catch (error) {
        log("ERROR", `folder-handler createTemporaryCompressedPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export function createAllFolder() {
    // createRootFolder()
    // createRootFolderExternal()
    createPdfFolder()
    createExportedFolder()
    createPictureFolder()
    // createTemporaryFolder()
    createTemporaryExportedFolder()
    createTemporaryCompressedPictureFolder()
}
