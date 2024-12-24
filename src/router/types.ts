import { RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"


export type ScreenAction = "add-picture" | "replace-picture" | undefined


export type AddPictureParam = {
  screenAction: "add-picture"
}

export type ReplacePictureParam = {
  screenAction: "replace-picture"
  replaceIndex: number
}

export type VisualizePictureParam = {
  pictureIndex: number
}


export type ScreenParams = {
  Home: undefined
  Camera: AddPictureParam | ReplacePictureParam | undefined
  EditDocument: undefined
  ConvertPdfOption: undefined
  RenameDocument: undefined
  Settings: undefined
  ChangeTheme: undefined
  Gallery: AddPictureParam | ReplacePictureParam
  VisualizePicture: VisualizePictureParam
}

export type ScreenName = keyof ScreenParams


export type NavigationProps<T extends ScreenName> =
  NativeStackNavigationProp<ScreenParams, T>

export type RouteProps<T extends ScreenName> = RouteProp<ScreenParams, T>
