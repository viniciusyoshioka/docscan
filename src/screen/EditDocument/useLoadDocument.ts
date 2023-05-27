import { Realm } from "@realm/react"
import { useEffect } from "react"

import { DocumentPictureSchema, DocumentSchema, useDocumentModel, useDocumentRealm } from "../../database"


export function useLoadDocument(documentId: string | undefined) {


    const id = documentId ? Realm.BSON.ObjectId.createFromHexString(documentId) : undefined


    const documentRealm = useDocumentRealm()
    const { setDocumentModel } = useDocumentModel()


    function getDocument() {
        if (!id) return

        const document = documentRealm.objectForPrimaryKey<DocumentSchema>("DocumentSchema", id)
        if (!document) throw new Error("Document not found. This should not happen")

        const pictures = documentRealm
            .objects<DocumentPictureSchema>("DocumentPictureSchema")
            .filtered("belongsToDocument = $0", id)
            .sorted("position")
        if (!pictures) throw new Error("Pictures not found. This should not happen")

        setDocumentModel({
            type: "setData",
            payload: {
                realm: documentRealm,
                document,
                pictures,
            },
        })
    }


    useEffect(() => {
        getDocument()
    }, [])
}
