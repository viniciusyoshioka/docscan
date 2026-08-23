import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'


export enum PictureAction {
  ADD_PICTURE = 'ADD_PICTURE',
  REPLACE_PICTURE = 'REPLACE_PICTURE',
}

export type PictureActionParams =
  | {
    action: PictureAction.ADD_PICTURE
  }
  | {
    action: PictureAction.REPLACE_PICTURE
    replaceIndex: number
  }

export type VisualizePictureParams = {
  pictureIndex: number
}


export type ScreenParams = {
  Home: undefined
  Settings: undefined
  ChangeTheme: undefined
  Camera: PictureActionParams | undefined
  Gallery: PictureActionParams
  DocumentDetail: undefined
  ConvertDocumentToPdf: undefined
  RenameDocument: undefined
  PictureDetail: VisualizePictureParams
}

export type ScreenName = keyof ScreenParams


export type NavigationProps<
  CurrentScreen extends ScreenName,
> = NativeStackNavigationProp<ScreenParams, CurrentScreen>

export type RouteProps<
  CurrentScreen extends ScreenName,
> = RouteProp<ScreenParams, CurrentScreen>
