import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


/**
 * Defines the screen's params and its types
 */
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
    Gallery: {
        screenAction: "replace-picture";
        replaceIndex: number;
    } | undefined;
    VisualizePicture: {
        pictureIndex: number;
    };
}


/**
 * Props to add type for navigation props
 */
export type NavigationParamProps<T extends keyof ScreenParams> = NativeStackNavigationProp<ScreenParams, T>


/**
 * Props to add type for route props
 */
export type RouteParamProps<T extends keyof ScreenParams> = RouteProp<ScreenParams, T>
