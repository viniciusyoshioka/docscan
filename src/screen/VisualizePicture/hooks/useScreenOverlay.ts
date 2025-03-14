import { useState } from "react"


interface ScreenOverlay {
  isVisible: boolean
  toggleVisibility: () => void
}


export function useScreenOverlay(): ScreenOverlay {


  const [isVisible, setIsVisible] = useState(true)


  function toggleVisibility() {
    setIsVisible(currentIsVisible => !currentIsVisible)
  }


  return {
    isVisible,
    toggleVisibility,
  }
}
