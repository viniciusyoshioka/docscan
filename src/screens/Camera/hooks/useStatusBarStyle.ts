import { useEffect } from 'react'
import { StatusBar } from 'react-native'

import { useAppTheme } from '@theme'


interface StatusBarStyleParam {
  isShowingCamera: boolean
}


export function useStatusBarStyle(params: StatusBarStyleParam) {
  const { isShowingCamera } = params


  const { isDark } = useAppTheme()


  function updateStatusBarStyle() {
    const isDarkStyle = isShowingCamera || isDark
    const style = isDarkStyle ? 'light-content' : 'dark-content'
    setTimeout(() => StatusBar.setBarStyle(style), 50)
  }


  useEffect(() => {
    updateStatusBarStyle()

    return () => updateStatusBarStyle()
  }, [isShowingCamera, isDark])
}
