import { useCallback, useMemo, useState } from 'react'


interface CameraErrorParams {
  onErrorCallback?: (error: Error) => void
}


interface CameraError {
  error: Error | null
  onError: (error: Error) => void
}


export function useCameraError(params?: CameraErrorParams): CameraError {
  const { onErrorCallback } = params ?? {}


  const [error, setError] = useState<Error | null>(null)


  const onError = useCallback((err: Error) => {
    setError(err)
    onErrorCallback?.(err)
  }, [onErrorCallback])


  const cameraError = useMemo(() => ({
    error,
    onError,
  }), [error, onError])


  return cameraError
}
