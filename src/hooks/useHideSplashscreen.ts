import { useCallback, useEffect } from 'react'
import { hide } from 'react-native-bootsplash'


export function useHideSplashscreen(hideOnScreenOpen = true) {


  const hideSplashscreen = useCallback(() => {
    hide({ fade: true })
  }, [])


  useEffect(() => {
    if (hideOnScreenOpen) {
      hideSplashscreen()
    }
  }, [])


  return hideSplashscreen
}
