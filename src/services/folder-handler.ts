import RNFS from "react-native-fs"

import { fullPathExported, fullPathPdf, fullPathPicture, fullPathTemporaryCompressedPicture, fullPathTemporaryExported, fullPathTemporaryImported } from "./constant"
import { log, stringfyError } from "./log"
import { getWritePermission } from "./permission"


// TODO change paths according to Android's permission


export async function createPdfFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create pdf folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathPdf)
    } catch (error) {
        log.error(`Error creating pdf folder: "${stringfyError(error)}"`)
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
        log.error(`Error creating exported folder: "${stringfyError(error)}"`)
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
        log.error(`Error creating picture folder: "${stringfyError(error)}"`)
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
        log.error(`Error creating temporary exported folder: "${stringfyError(error)}"`)
    }
}


export async function createTemporaryImportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create temporary imported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryImported)
    } catch (error) {
        log.error(`Error creating temporary imported folder: "${stringfyError(error)}"`)
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
        log.error(`Error creating temporary compressed folder: "${stringfyError(error)}"`)
    }
}


export async function createAllFolders() {
    await createPdfFolder()
    await createExportedFolder()
    await createPictureFolder()
    await createTemporaryExportedFolder()
    await createTemporaryImportedFolder()
    await createTemporaryCompressedPictureFolder()
}
