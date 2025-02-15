import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


export type PictureActionParams =
  | {
    action: "add-picture"
  }
  | {
    action: "replace-picture"
    replaceIndex: number
  }

export type VisualizePictureParams = {
  pictureIndex: number
}


export type ScreenParams = {
  Home: undefined
  Camera: PictureActionParams | undefined
  EditDocument: undefined
  ConvertPdfOption: undefined
  RenameDocument: undefined
  Settings: undefined
  ChangeTheme: undefined
  Gallery: PictureActionParams
  VisualizePicture: VisualizePictureParams
}

export type ScreenName = keyof ScreenParams

export type PictureAction = PictureActionParams["action"]


export type NavigationProps<T extends ScreenName> = NativeStackNavigationProp<ScreenParams, T>

export type RouteProps<T extends ScreenName> = RouteProp<ScreenParams, T>
