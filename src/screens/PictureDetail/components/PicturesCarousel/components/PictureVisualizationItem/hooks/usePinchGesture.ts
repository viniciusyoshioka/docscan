import { useMemo } from 'react'
import type { PinchGesture } from 'react-native-gesture-handler'
import {
  usePinchGesture as usePinchGestureHandler,
} from 'react-native-gesture-handler'


interface OnPinchGestureParams {
  focalX: number
  focalY: number
  scale: number
}


interface PinchGestureParams {
  onActivate?: (params: OnPinchGestureParams) => void
  onUpdate?: (params: OnPinchGestureParams) => void
  onDeactivate?: (params: OnPinchGestureParams) => void
}


interface UsePinchGesture {
  pinchGesture: PinchGesture
}


export function usePinchGesture(
  params?: PinchGestureParams,
): UsePinchGesture {
  const { onActivate, onUpdate, onDeactivate } = params ?? {}


  const pinchGesture = usePinchGestureHandler({
    onActivate: event => {
      'worklet'

      if (event.numberOfPointers !== 2) {
        return
      }

      if (onActivate) {
        const onPinchGestureParams: OnPinchGestureParams = {
          focalX: event.focalX,
          focalY: event.focalY,
          scale: event.scale,
        }

        onActivate(onPinchGestureParams)
      }
    },
    onUpdate: event => {
      'worklet'

      if (event.numberOfPointers !== 2) {
        return
      }

      if (onUpdate) {
        const onPinchGestureParams: OnPinchGestureParams = {
          focalX: event.focalX,
          focalY: event.focalY,
          scale: event.scale,
        }

        onUpdate(onPinchGestureParams)
      }
    },
    onDeactivate: event => {
      'worklet'

      if (onDeactivate) {
        const onPinchGestureParams: OnPinchGestureParams = {
          focalX: event.focalX,
          focalY: event.focalY,
          scale: event.scale,
        }

        onDeactivate(onPinchGestureParams)
      }
    },
  })


  const pinchGestureResult = useMemo(() => ({
    pinchGesture,
  }), [pinchGesture])


  return pinchGestureResult
}
