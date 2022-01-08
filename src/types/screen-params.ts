import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


export type ScreenParams = {
    Home: undefined;
    Camera: {
        screenAction: "replace-picture";
        replaceIndex: number;
    } | undefined;
    EditDocument: {
        documentId: number;
    } | undefined;
    Settings: undefined;
    FileExplorer: undefined;
    ImportImageFromGalery: {
        screenAction: "replace-picture";
        replaceIndex: number;
    } | undefined;
    VisualizePicture: {
        pictureIndex: number;
    };
}


export type NavigationParamProps<T extends keyof ScreenParams> = NativeStackNavigationProp<ScreenParams, T>


export type RouteParamProps<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>
