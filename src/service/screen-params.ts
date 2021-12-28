import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { Document } from "../types"


export type ScreenParams = {
    Home: undefined,
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
    Settings: undefined,
    FileExplorer: undefined,
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


export type NavigationParamProps<T extends keyof ScreenParams> = NativeStackNavigationProp<ScreenParams, T>


export type RouteParamProps<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>
