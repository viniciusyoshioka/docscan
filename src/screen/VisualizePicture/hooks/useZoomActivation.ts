import { useCallback, useMemo, useState } from "react"


interface ZoomActivation {
  isZoomActive: boolean
  onZoomActivated: () => void
  onZoomDeactivated: () => void
}


export function useZoomActivation(): ZoomActivation {


  const [isZoomActive, setIsZoomActive] = useState(false)


  const onZoomActivated = useCallback(() => {
    setIsZoomActive(true)
  }, [])

  const onZoomDeactivated = useCallback(() => {
    setIsZoomActive(false)
  }, [])


  const zoomActivation = useMemo(() => ({
    isZoomActive,
    onZoomActivated,
    onZoomDeactivated,
  }), [
    isZoomActive,
    onZoomActivated,
    onZoomDeactivated,
  ])


  return zoomActivation
}
