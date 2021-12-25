import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathRootExternal, fullPathExported, fullPathTemporary, fullPathTemporaryExported, fullPathTemporaryCompressedPicture } from "./constant"
import { getWritePermission } from "./permission"


async function createRootFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create root folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathRoot)
    } catch (error) {
        console.log(`folder-handler createRootFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


async function createRootFolderExternal() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create external root folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathRootExternal)
    } catch (error) {
        console.log(`folder-handler createRootFolderExternal - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


async function createPdfFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create pdf folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathPdf)
    } catch (error) {
        console.log(`folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createExportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create exported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathExported)
    } catch (error) {
        console.log(`folder-handler createExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createPictureFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create picture folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathPicture)
    } catch (error) {
        console.log(`folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create temporary folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporary)
    } catch (error) {
        console.log(`folder-handler createTemporaryFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryExportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create temporary exported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryExported)
    } catch (error) {
        console.log(`folder-handler createTemporaryExportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


export async function createTemporaryCompressedPictureFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        console.log("Can't create temporary compressed folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryCompressedPicture)
    } catch (error) {
        console.log(`folder-handler createTemporaryCompressedPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
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
