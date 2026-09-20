import { useMemo } from 'react'
import type { TapGesture } from 'react-native-gesture-handler'
import { useTapGesture } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'


interface OnDoubleTapParams {
  x: number
  y: number
  absoluteX: number
  absoluteY: number
}


interface DoubleTapGestureParams {
  onDoubleTap?: (params: OnDoubleTapParams) => void
}


interface UseDoubleTapGesture {
  doubleTapGesture: TapGesture
}


export function useDoubleTapGesture(
  params?: DoubleTapGestureParams,
): UseDoubleTapGesture {
  const { onDoubleTap } = params ?? {}


  const tapGesture = useTapGesture({
    numberOfTaps: 2,
    maxDistance: 20,
    maxDuration: 200,
    onActivate: event => {
      if (event.numberOfPointers !== 1) {
        return
      }

      if (onDoubleTap) {
        const doubleTapParams: OnDoubleTapParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
        }

        scheduleOnRN(onDoubleTap, doubleTapParams)
      }
    },
  })


  const doubleTapGesture = useMemo(() => ({
    doubleTapGesture: tapGesture,
  }), [tapGesture])


  return doubleTapGesture
}
