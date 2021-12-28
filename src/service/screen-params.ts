import { Document } from "../types"


export type ScreenParams = {
    Camera: {
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
        screenAction?: "replace-picture",
        replaceIndex?: number,
    } | undefined,
    EditDocument: {
        document: Document | undefined,
        documentName?: string,
        pictureList?: Array<string>,
        isChanged?: boolean,
    },
    ImportImageFromGalery: {
        document: Document | undefined,
        documentName: string | undefined,
        pictureList: Array<string>,
        screenAction?: "replace-picture",
        replaceIndex?: number,
    },
    VisualizePicture: {
        pictureIndex: number,
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
        isChanged?: boolean,
    },
}
