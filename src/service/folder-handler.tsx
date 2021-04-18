import RNFS from "react-native-fs"

import { fullPathRoot, fullPathPdf, fullPathPicture, fullPathPictureOriginal, fullPathPictureCropped } from "./constant"
import { log } from "./log"


function createRootFolder() {
    RNFS.exists(fullPathRoot)
        .then((exists: boolean) => {
            if (!exists) {
                RNFS.mkdir(fullPathRoot)
                    .catch((error) => {
                        log("ERROR", `folder-handler createRootFolder - Erro ao criar pasta. Mensagem: "${error}"`)
                    })
            }
        })
        .catch((error) => {
            log("ERROR", `folder-handler createRootFolder - Erro ao criar pasta. Mensagem: "${error}"`)
        })
}

function createPdfFolder() {
    RNFS.exists(fullPathPdf)
        .then((exists: boolean) => {
            if (!exists) {
                RNFS.mkdir(fullPathPdf)
                    .catch((error) => {
                        log("ERROR", `folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
                    })
            }
        })
        .catch((error) => {
            log("ERROR", `folder-handler createPdfFolder - Erro ao criar pasta. Mensagem: "${error}"`)
        })
}

function createPictureFolder() {
    RNFS.exists(fullPathPicture)
        .then((exists: boolean) => {
            if (!exists) {
                RNFS.mkdir(fullPathPicture)
                    .catch((error) => {
                        log("ERROR", `folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
                    })
            }
        })
        .catch((error) => {
            log("ERROR", `folder-handler createPictureFolder - Erro ao criar pasta. Mensagem: "${error}"`)
        })
}

function createPictureOriginalFolder() {
    RNFS.exists(fullPathPictureOriginal)
        .then((exists: boolean) => {
            if (!exists) {
                RNFS.mkdir(fullPathPictureOriginal)
                    .catch((error) => {
                        log("ERROR", `folder-handler createPictureOriginalFolder - Erro ao criar pasta. Mensagem: "${error}"`)
                    })
            }
        })
        .catch((error) => {
            log("ERROR", `folder-handler createPictureOriginalFolder - Erro ao criar pasta. Mensagem: "${error}"`)
        })
}

function createPictureCroppedFolder() {
    RNFS.exists(fullPathPictureCropped)
        .then((exists: boolean) => {
            if (!exists) {
                RNFS.mkdir(fullPathPictureCropped)
                    .catch((error) => {
                        log("ERROR", `folder-handler createPictureCroppedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
                    })
            }
        })
        .catch((error) => {
            log("ERROR", `folder-handler createPictureCroppedFolder - Erro ao criar pasta. Mensagem: "${error}"`)
        })
}

export function createAllFolder() {
    // createRootFolder()
    createPdfFolder()
    // createPictureFolder()
    createPictureOriginalFolder()
    createPictureCroppedFolder()
}
