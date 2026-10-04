import { useCallback, useMemo, useState } from 'react'


interface UseCameraSettings {
  isVisible: boolean
  show: () => void
  hide: () => void
}


export function useCameraSettings(): UseCameraSettings {


  const [isVisible, setIsVisible] = useState(false)


  const show = useCallback(() => {
    setIsVisible(true)
  }, [])

  const hide = useCallback(() => {
    setIsVisible(false)
  }, [])


  const cameraSettings = useMemo<UseCameraSettings>(() => ({
    isVisible,
    show,
    hide,
  }), [isVisible, show, hide])


  return cameraSettings
}
