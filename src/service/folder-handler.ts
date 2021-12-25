import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathRootExternal, fullPathExported, fullPathTemporary, fullPathTemporaryExported, fullPathTemporaryCompressedPicture } from "./constant"
import { log } from "./log"
import { getWritePermission } from "./permission"


async function createRootFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create root folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathRoot)
    } catch (error) {
        log.error(`folder-handler createRootFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


async function createRootFolderExternal() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create external root folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathRootExternal)
    } catch (error) {
        log.error(`folder-handler createRootFolderExternal - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


async function createPdfFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create pdf folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathPdf)
    } catch (error) {
        log.error(`folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createExportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create exported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathExported)
    } catch (error) {
        log.error(`folder-handler createExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createPictureFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create picture folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathPicture)
    } catch (error) {
        log.error(`folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create temporary folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporary)
    } catch (error) {
        log.error(`folder-handler createTemporaryFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryExportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create temporary exported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryExported)
    } catch (error) {
        log.error(`folder-handler createTemporaryExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryCompressedPictureFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create temporary compressed folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryCompressedPicture)
    } catch (error) {
        log.error(`folder-handler createTemporaryCompressedPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
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
