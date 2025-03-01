import { useCallback, useEffect } from "react"
import { StatusBar } from "react-native"

import { useAppTheme } from "@theme"


export function useStatusBarStyle(isShowingCamera: boolean) {


  const { isDark } = useAppTheme()


  const updateStatusBarStyle = useCallback((isDarkStyle: boolean) => {
    const style = isDarkStyle ? "light-content" : "dark-content"
    setTimeout(() => StatusBar.setBarStyle(style), 50)
  }, [])


  useEffect(() => {
    updateStatusBarStyle(isShowingCamera || isDark)

    return () => updateStatusBarStyle(isDark)
  }, [isShowingCamera, isDark])
}
