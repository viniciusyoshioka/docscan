import { Document } from "./object-types"


// Camera
interface CameraParam {
    document: Document | undefined,
    documentName: string,
    pictureList: Array<string>,
    screenAction?: "replace-picture",
    replaceIndex?: number,
}


export type ScreenParams = {
    Camera: CameraParam | undefined,
    EditDocument: {
        document: Document | undefined,
        documentName?: string,
        pictureList?: Array<string>,
        isChanged?: boolean,
    },
    ImportImageFromGalery: {
        document: Document | undefined,
        documentName: string | null,
        pictureList: Array<string>,
        screenAction?: "replace-picture",
        replaceIndex?: number,
    },
    VisualizePicture: {
        picturePath: string,
        pictureIndex: number,
        document: Document | undefined,
        documentName: string,
        pictureList: Array<string>,
    },
}
