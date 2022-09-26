import RNFS from "react-native-fs"

import { fullPathExported, fullPathPdf, fullPathPicture, fullPathRoot, fullPathRootExternal, fullPathTemporary, fullPathTemporaryCompressedPicture, fullPathTemporaryExported, fullPathTemporaryImported } from "./constant"
import { log } from "./log"
import { getWritePermission } from "./permission"


/**
 * Creates the app root folder.
 * The folder is created inside app's private directory.
 */
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


/**
 * Creates the app external root folder.
 * The folder is created in external storage directory.
 */
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


/**
 * Creates the folder to store generated PDF files
 */
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


/**
 * Creates the folder to store the exported document
 */
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


/**
 * Creates the internal folder to store picture files
 */
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


/**
 * Creates the internal folder to store temporary files
 */
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


/**
 * Creates the internal folder to store, temporarialy,
 * exported document files, before moving them to their directory
 */
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


/**
 * Creates the internal folder to store, temporarialy,
 * imported document files, before moving them to their directory
 */
export async function createTemporaryImportedFolder() {
    const hasWritePermission = await getWritePermission()
    if (!hasWritePermission) {
        log.warn("Can't create temporary imported folder without write external storage permission")
        return
    }

    try {
        await RNFS.mkdir(fullPathTemporaryImported)
    } catch (error) {
        log.error(`folder-handler createTemporaryImportedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
    }
}


/**
 * Creates the internal folder to store, temporarialy, the
 * compressed pictures files, while the pdf is being created.
 */
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


/**
 * Creates all folder needed by the app
 *
 * Executes each function as a promise
 */
export function createAllFolder() {
    // createRootFolder()
    // createRootFolderExternal()
    createPdfFolder()
    createExportedFolder()
    createPictureFolder()
    // createTemporaryFolder()
    createTemporaryExportedFolder()
    createTemporaryImportedFolder()
    createTemporaryCompressedPictureFolder()
}


/**
 * Creates all folder needed by the app
 *
 * Execute each function with async/await waiting for
 * one function ends to start another
 */
export async function createAllFolderAsync() {
    // await createRootFolder()
    // await createRootFolderExternal()
    await createPdfFolder()
    await createExportedFolder()
    await createPictureFolder()
    // await createTemporaryFolder()
    await createTemporaryExportedFolder()
    await createTemporaryImportedFolder()
    await createTemporaryCompressedPictureFolder()
}
