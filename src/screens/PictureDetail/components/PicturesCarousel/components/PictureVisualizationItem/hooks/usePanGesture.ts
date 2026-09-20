import { useCallback, useMemo, useState } from 'react'
import type { PanGesture } from 'react-native-gesture-handler'
import {
  usePanGesture as usePanGestureHandler,
} from 'react-native-gesture-handler'


interface OnBeginParams {
  x: number
  y: number
  absoluteX: number
  absoluteY: number
}

interface OnPanGestureParams {
  x: number
  y: number
  absoluteX: number
  absoluteY: number
  translationX: number
  translationY: number
  velocityX: number
  velocityY: number
}


interface PanGestureParams {
  onBegin?: (params: OnBeginParams) => void
  onActivate?: (params: OnPanGestureParams) => void
  onUpdate?: (params: OnPanGestureParams) => void
  onDeactivate?: (params: OnPanGestureParams) => void
}


interface UsePanGesture {
  isEnabled: boolean
  enablePanGesture: () => void
  disablePanGesture: () => void
  panGesture: PanGesture
}


export function usePanGesture(
  params?: PanGestureParams,
): UsePanGesture {
  const { onBegin, onActivate, onUpdate, onDeactivate } = params ?? {}


  const [isEnabled, setIsEnabled] = useState(false)

  const enablePanGesture = useCallback(() => {
    setIsEnabled(true)
  }, [])

  const disablePanGesture = useCallback(() => {
    setIsEnabled(false)
  }, [])


  const panGesture = usePanGestureHandler({
    maxPointers: 1,
    enabled: isEnabled,
    onBegin: event => {
      'worklet'

      if (onBegin) {
        const onBeginParams: OnBeginParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
        }

        onBegin(onBeginParams)
      }
    },
    onActivate: event => {
      'worklet'

      if (onActivate) {
        const onActivateParams: OnPanGestureParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
          translationX: event.translationX,
          translationY: event.translationY,
          velocityX: event.velocityX,
          velocityY: event.velocityY,
        }

        onActivate(onActivateParams)
      }
    },
    onUpdate: event => {
      'worklet'

      if (onUpdate) {
        const onUpdateParams: OnPanGestureParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
          translationX: event.translationX,
          translationY: event.translationY,
          velocityX: event.velocityX,
          velocityY: event.velocityY,
        }

        onUpdate(onUpdateParams)
      }
    },
    onDeactivate: event => {
      'worklet'

      if (onDeactivate) {
        const onDeactivateParams: OnPanGestureParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
          translationX: event.translationX,
          translationY: event.translationY,
          velocityX: event.velocityX,
          velocityY: event.velocityY,
        }

        onDeactivate(onDeactivateParams)
      }
    },
  })


  const panGestureResult = useMemo(() => ({
    isEnabled,
    enablePanGesture,
    disablePanGesture,
    panGesture,
  }), [isEnabled, panGesture])


  return panGestureResult
}
