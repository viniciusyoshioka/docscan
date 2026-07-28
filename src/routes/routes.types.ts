import type { RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'


export type ScreenParams = {
  Home: undefined
  Settings: undefined
  ChangeTheme: undefined
  Camera: undefined
  Gallery: undefined
  DocumentDetail: undefined
  PictureDetail: undefined
}

export type ScreenName = keyof ScreenParams


export type NavigationProps<
  CurrentScreen extends ScreenName,
> = NativeStackNavigationProp<ScreenParams, CurrentScreen>

export type RouteProps<
  CurrentScreen extends ScreenName,
> = RouteProp<ScreenParams, CurrentScreen>
