import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CameraDevice, CameraRef } from 'react-native-vision-camera'

import { useLogger } from '@modules/logger'
import { normalizeError } from '@utils'
import type { FocusIndicatorRef } from '../components'


interface FocusCameraParams {
  cameraDevice: CameraDevice | undefined
  cameraRef: RefObject<CameraRef | null>
  focusIndicatorRef: RefObject<FocusIndicatorRef | null>
  isSettingsOpen: boolean
}


type FocusCamera = (posX: number, posY: number) => Promise<void>

interface FocusCameraResult {
  isFocusEnabled: boolean
  focus: FocusCamera
}


export function useFocusCamera(params: FocusCameraParams): FocusCameraResult {
  const { cameraDevice, cameraRef, focusIndicatorRef, isSettingsOpen } = params


  const logger = useLogger()

  const isFocusSupported = !!cameraDevice?.supportsFocusMetering
  const [isFocusEnabled, setIsFocusEnabled] = useState(true)


  const focus = useCallback(async (posX: number, posY: number) => {
    if (!isFocusSupported) {
      await logger.debug('The camera device does not support focus')
      return
    }
    if (!isFocusEnabled) {
      await logger.debug('Focus is disabled')
      return
    }
    if (!focusIndicatorRef.current) {
      await logger.debug('focusIndicatorRef is not set')
    }
    if (!cameraRef.current) {
      await logger.debug('cameraRef is not set')
      return
    }

    try {
      const x = Number(posX.toFixed())
      const y = Number(posY.toFixed())

      setIsFocusEnabled(false)
      focusIndicatorRef.current?.setPosition({ x, y })
      focusIndicatorRef.current?.setIsFocusing(true)

      await cameraRef.current.focusTo({ x, y }, {
        adaptiveness: 'locked',
        responsiveness: 'snappy',
        autoResetAfter: null,
      })

      focusIndicatorRef.current?.setIsFocusing(false)
      setIsFocusEnabled(true)
    } catch (error) {
      const errorInstance = normalizeError(error)
      const errorMessage = errorInstance.message
      const errorStack = errorInstance.stack

      await logger.error(
        `Error focusing camera: "${errorMessage}"`,
        errorStack,
      )

      focusIndicatorRef.current?.setIsFocusing(false)
      setIsFocusEnabled(true)
    }
  }, [isFocusSupported, isFocusEnabled, focusIndicatorRef, cameraRef, logger])


  useEffect(() => {
    const newIsFocusEnabled = !isSettingsOpen
    setIsFocusEnabled(newIsFocusEnabled)
  }, [isSettingsOpen])


  const focusCameraResult = useMemo<FocusCameraResult>(() => ({
    isFocusEnabled,
    focus,
  }), [isFocusEnabled, focus])


  return focusCameraResult
}
