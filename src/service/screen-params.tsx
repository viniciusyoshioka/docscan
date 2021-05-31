import { Document } from "./object-types"


export type ScreenParams = {
    Camera: {
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
        screenAction?: "replace-picture",
        replaceIndex?: number,
        picturePath?: string,
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
        picturePath?: string,
    },
    VisualizePicture: {
        picturePath: string,
        pictureIndex: number,
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
        isChanged?: boolean,
    },
}
