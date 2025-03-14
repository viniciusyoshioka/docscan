import { useState } from "react"


interface ZoomActivation {
  isZoomActive: boolean
  onZoomActivated: () => void
  onZoomDeactivated: () => void
}


export function useZoomActivation(): ZoomActivation {


  const [isZoomActive, setIsZoomActive] = useState(false)


  function onZoomActivated() {
    setIsZoomActive(true)
  }

  function onZoomDeactivated() {
    setIsZoomActive(false)
  }


  return {
    isZoomActive,
    onZoomActivated,
    onZoomDeactivated,
  }
}
