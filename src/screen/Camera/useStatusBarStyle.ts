import { useEffect } from "react"
import { StatusBar } from "react-native"

import { useAppTheme } from "@theme"


export function useStatusBarStyle(isShowingCamera: boolean) {


    const { isDark } = useAppTheme()


    useEffect(() => {
        if (isShowingCamera) {
            StatusBar.setBarStyle("light-content")
        } else {
            StatusBar.setBarStyle(isDark ? "light-content" : "dark-content")
        }
    }, [isShowingCamera, isDark])
}
