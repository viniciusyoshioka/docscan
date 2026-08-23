import { useRoute } from '@react-navigation/native'

import type { RouteProps, ScreenName } from '../routes.types.ts'


export function useScreenParams<
  S extends ScreenName,
>(): Readonly<RouteProps<S>['params']> {


  const { params } = useRoute<RouteProps<S>>()


  return params as Readonly<RouteProps<S>['params']>
}
