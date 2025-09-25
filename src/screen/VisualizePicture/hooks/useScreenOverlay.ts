import { useCallback, useMemo, useState } from "react"


interface ScreenOverlay {
  isVisible: boolean
  toggleVisibility: () => void
}


export function useScreenOverlay(): ScreenOverlay {


  const [isVisible, setIsVisible] = useState(true)


  const toggleVisibility = useCallback(() => {
    setIsVisible(currentIsVisible => !currentIsVisible)
  }, [])


  const screenOverlay = useMemo(() => ({
    isVisible,
    toggleVisibility,
  }), [
    isVisible,
    toggleVisibility,
  ])


  return screenOverlay
}
