import { useEffect, useState } from "react"


export function useIsCaptureButtonEnabled(isCameraActive: boolean): boolean {


  const [isCaptureButtonEnabled, setIsCaptureButtonEnabled] = useState(false)


  useEffect(() => {
    setIsCaptureButtonEnabled(isCameraActive)
  }, [isCameraActive])


  return isCaptureButtonEnabled
}
