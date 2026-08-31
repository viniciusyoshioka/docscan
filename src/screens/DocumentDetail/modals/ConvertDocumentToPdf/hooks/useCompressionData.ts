import { useCallback, useMemo, useState } from 'react'

import { CompressionLevel } from '../convert-document-to-pdf.constants.ts'


type CompressionLevelToValueMap = {
  [key in CompressionLevel]: number
}

const compressionLevelToValueMap: CompressionLevelToValueMap = {
  [CompressionLevel.LOW]: 20,
  [CompressionLevel.HIGH]: 60,
  [CompressionLevel.CUSTOM]: 50,
}


interface CompressionData {
  compressionLevel: CompressionLevel
  compressionValue: number
  compressionVisualValue: number
  isCustomCompression: boolean
  isCustomCompressionDisabled: boolean
  onCompressionLevelChange: (value: string) => void
  onCompressionValueChange: (value: number) => void
  onCompressionVisualValueChange: (value: number) => void
}


export function useCompressionData(): CompressionData {


  const [compressionLevel, setCompressionLevel] = useState(
    CompressionLevel.HIGH,
  )
  const [compressionValue, setCompressionValue] = useState(
    compressionLevelToValueMap[compressionLevel],
  )
  const [compressionVisualValue, setCompressionVisualValue] = useState(
    compressionLevelToValueMap[compressionLevel],
  )


  const isCustomCompression = compressionLevel === CompressionLevel.CUSTOM
  const isCustomCompressionDisabled = !isCustomCompression


  const onCompressionLevelChange = useCallback((value: string) => {
    const newCompressionLevel = value as CompressionLevel
    const newCompressionValue = compressionLevelToValueMap[newCompressionLevel]

    setCompressionLevel(newCompressionLevel)
    setCompressionValue(newCompressionValue)
    setCompressionVisualValue(newCompressionValue)
  }, [])

  const onCompressionValueChange = useCallback((value: number) => {
    setCompressionValue(value)
  }, [])

  const onCompressionVisualValueChange = useCallback((value: number) => {
    setCompressionVisualValue(value)
  }, [])


  const compressionData = useMemo<CompressionData>(() => ({
    compressionLevel,
    compressionValue,
    compressionVisualValue,
    isCustomCompression,
    isCustomCompressionDisabled,
    onCompressionLevelChange,
    onCompressionValueChange,
    onCompressionVisualValueChange,
  }), [
    compressionLevel,
    compressionValue,
    compressionVisualValue,
    isCustomCompression,
    isCustomCompressionDisabled,
    onCompressionLevelChange,
    onCompressionValueChange,
    onCompressionVisualValueChange,
  ])


  return compressionData
}
