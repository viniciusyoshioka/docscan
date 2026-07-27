import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from '@react-navigation/native'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useMemo } from 'react'

import { Home } from '@screens/Home'
import { useAppTheme } from '@theme'
import type { ScreenParams } from './routes.types.ts'


const NativeStack = createNativeStackNavigator<ScreenParams>()


export function Router() {


  const { isDark, colors } = useAppTheme()

  const navigationTheme = isDark ? DarkTheme : DefaultTheme


  const stackNavigatorScreenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      animation: 'fade',
      headerShown: false,
      statusBarBackgroundColor: 'transparent',
      statusBarTranslucent: true,
      statusBarStyle: isDark ? 'light' : 'dark',
      contentStyle: {
        backgroundColor: colors.background,
      },
    }),
    [isDark, colors],
  )

  const modalScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
    presentation: 'transparentModal',
    contentStyle: {
      backgroundColor: 'transparent',
    },
  }), [])


  return (
    <NavigationContainer>
      <ThemeProvider value={navigationTheme}>
        <NativeStack.Navigator
          initialRouteName={'Home'}
          screenOptions={stackNavigatorScreenOptions}
        >
          <NativeStack.Screen name={'Home'} component={Home} />

          <NativeStack.Group screenOptions={modalScreenOptions}>
            {null}
          </NativeStack.Group>
        </NativeStack.Navigator>
      </ThemeProvider>
    </NavigationContainer>
  )
}
