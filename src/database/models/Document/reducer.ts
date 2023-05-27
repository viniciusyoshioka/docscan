import { Realm } from "@realm/react"

import { DocumentService } from "../../../services/document"
import { Document, DocumentPicture } from "../../interfaces"
import { DocumentPictureSchema, DocumentSchema } from "../../schemas"
import { DocumentModelConversor } from "./DocumentModelConversor"
import {
    DocumentModelAction,
    DocumentModelActionObject,
    DocumentModelActionPayload,
    DocumentModelActionType,
    DocumentModelState,
} from "./types"


function createNewIfEmpty(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["createNewIfEmpty"]): DocumentModelState | undefined {
    if (previousState !== undefined) return previousState

    const creationTime = Date.now()
    return {
        createdAt: creationTime,
        modifiedAt: creationTime,
        name: DocumentService.getNewName(),
        pictures: [],
    }
}


function setData(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["setData"]): DocumentModelState | undefined {
    const { realm, document, pictures } = payload


    let __documentFromRealm: DocumentSchema | undefined
    let modelDocument: Document
    let modelPictures: DocumentPicture[]


    if (document instanceof DocumentSchema) {
        __documentFromRealm = document
        modelDocument = DocumentModelConversor.fromDocumentRealmToJson(document)
    } else {
        const documentObjectId = Realm.BSON.ObjectId.createFromHexString(document.id)
        const documentRead = realm.objectForPrimaryKey<DocumentSchema>("DocumentSchema", documentObjectId)
        if (!documentRead) throw new Error("Document not found in database to be set. This should not happen")

        __documentFromRealm = documentRead
        modelDocument = document
    }

    if (pictures.length === 0) {
        modelPictures = []
    } else if (pictures instanceof Realm.Results) {
        modelPictures = DocumentModelConversor.fromDocumentPicturesRealmToJson(pictures)
    } else {
        modelPictures = pictures as DocumentPicture[]
    }


    return {
        ...modelDocument,
        pictures: modelPictures,
        __documentFromRealm,
    }
}


function rename(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["rename"]): DocumentModelState | undefined {
    if (previousState === undefined) throw new Error("No document data to rename. This should not happen")


    const { realm, newName } = payload


    const modificationTime = Date.now()

    realm.write(() => {
        if (previousState.__documentFromRealm === undefined)
            throw new Error("No document data to rename. This should not happen")

        previousState.__documentFromRealm.name = newName
        previousState.__documentFromRealm.modifiedAt = modificationTime
    })

    return {
        ...previousState,
        name: newName,
        modifiedAt: modificationTime,
    }
}


function addPictures(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["addPictures"]): DocumentModelState | undefined {
    previousState = createNewIfEmpty(previousState, undefined)
    if (previousState === undefined) throw new Error("No document data to add picture. This should not happen")


    const { realm, picturesToAdd } = payload


    if (previousState.__documentFromRealm === undefined)
        previousState = saveIfNotWritten(previousState, { realm }) as DocumentModelState


    const modificationTime = Date.now()

    const documentPictures: DocumentPicture[] = realm.write(() => {
        if (previousState === undefined || previousState.__documentFromRealm === undefined)
            throw new Error("No document data to add picture. This should not happen")

        const documentPicturesJSON = picturesToAdd.map((picture, index) => {
            if (previousState === undefined || previousState.__documentFromRealm === undefined)
                throw new Error("No document data to add picture. This should not happen")

            const newPicture = realm.create<DocumentPictureSchema>("DocumentPictureSchema", {
                filePath: picture,
                position: previousState.pictures.length + index,
                belongsToDocument: previousState.__documentFromRealm.id,
            })

            return DocumentModelConversor.fromDocumentPictureRealmToJson(newPicture)
        })

        previousState.__documentFromRealm.modifiedAt = modificationTime
        return documentPicturesJSON
    })

    return {
        ...previousState,
        modifiedAt: modificationTime,
        pictures: [...previousState.pictures, ...documentPictures],
    }
}


function removePictures(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["removePictures"]): DocumentModelState | undefined {
    if (previousState === undefined || previousState.__documentFromRealm === undefined)
        throw new Error("No document data to remove picture. This should not happen")


    const { realm, picturesToRemove } = payload


    picturesToRemove.sort((a, b) => b - a)


    realm.write(() => {
        if (previousState === undefined || previousState.__documentFromRealm === undefined)
            throw new Error("No document data to remove picture. This should not happen")

        const picturesToRemoveFromDatabase = picturesToRemove.map(pictureIndex => {
            if (previousState === undefined || previousState.__documentFromRealm === undefined)
                throw new Error("No document data to remove picture. This should not happen")

            const pictureHexId = previousState.pictures[pictureIndex].id
            const pictureId = Realm.BSON.ObjectId.createFromHexString(pictureHexId)
            previousState.pictures.splice(pictureIndex, 1)
            return realm.objectForPrimaryKey<DocumentPictureSchema>("DocumentPictureSchema", pictureId)
        })
        realm.delete(picturesToRemoveFromDatabase)


        const modificationTime = Date.now()
        previousState.__documentFromRealm.modifiedAt = modificationTime
        previousState.modifiedAt = modificationTime
    })


    return previousState
}


function replacePicture(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["replacePicture"]): DocumentModelState | undefined {
    if (previousState === undefined || previousState.__documentFromRealm === undefined)
        throw new Error("No document data to replace picture. This should not happen")


    const { realm, indexToReplace, newPicturePath } = payload


    const pictureHexIdToReplace = previousState.pictures[indexToReplace].id
    const pictureIdToReplace = Realm.BSON.ObjectId.createFromHexString(pictureHexIdToReplace)
    const pictureToReplace = realm.objectForPrimaryKey<DocumentPictureSchema>("DocumentPictureSchema", pictureIdToReplace)
    if (!pictureToReplace) throw new Error("No document data to replace picture. This should not happen")


    const modificationTime = Date.now()

    realm.write(() => {
        if (previousState === undefined || previousState.__documentFromRealm === undefined)
            throw new Error("No document data to replace picture. This should not happen")

        previousState.__documentFromRealm.modifiedAt = modificationTime
        pictureToReplace.filePath = newPicturePath
    })

    previousState.pictures[indexToReplace].filePath = newPicturePath
    return {
        ...previousState,
        modifiedAt: modificationTime,
    }
}


function saveIfNotWritten(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["saveIfNotWritten"]): DocumentModelState | undefined {
    if (previousState === undefined) throw new Error("No document data to save. This should not happen")
    if (previousState.__documentFromRealm !== undefined || previousState.id !== undefined) return previousState


    const { realm } = payload


    const documentFromRealm: DocumentSchema = realm.write(() => {
        if (previousState === undefined) throw new Error("No document data to save. This should not happen")

        return realm.create<DocumentSchema>("DocumentSchema", {
            createdAt: previousState.createdAt,
            modifiedAt: previousState.modifiedAt,
            name: previousState.name,
        })
    })

    const documentJSON = DocumentModelConversor.fromDocumentRealmToJson(documentFromRealm)

    return {
        ...previousState,
        id: documentJSON.id,
        __documentFromRealm: documentFromRealm,
    }
}


function close(previousState: DocumentModelState | undefined, payload: DocumentModelActionPayload["close"]): DocumentModelState | undefined {
    return undefined
}


const actionReducerObject: DocumentModelActionObject = {
    createNewIfEmpty,
    setData,
    rename,
    addPictures,
    removePictures,
    replacePicture,
    saveIfNotWritten,
    close,
}


export function documentModelReducer<T extends DocumentModelActionType>(
    previousState: DocumentModelState | undefined,
    action: DocumentModelAction<T>
): DocumentModelState | undefined {

    const reducerFunction = actionReducerObject[action.type]
    if (reducerFunction === undefined)
        return previousState
    return reducerFunction(previousState, action.payload)
}
