import { useMemo } from 'react'
import type { TapGesture } from 'react-native-gesture-handler'
import { useTapGesture } from 'react-native-gesture-handler'
import { scheduleOnRN } from 'react-native-worklets'


interface OnSingleTapParams {
  x: number
  y: number
  absoluteX: number
  absoluteY: number
}


interface SingleTapGestureParams {
  onSingleTap?: (params: OnSingleTapParams) => void
}


interface UseSingleTapGesture {
  singleTapGesture: TapGesture
}


export function useSingleTapGesture(
  params?: SingleTapGestureParams,
): UseSingleTapGesture {
  const { onSingleTap } = params ?? {}


  const tapGesture = useTapGesture({
    numberOfTaps: 1,
    maxDistance: 20,
    maxDuration: 200,
    onActivate: event => {
      if (event.numberOfPointers !== 1) {
        return
      }

      if (onSingleTap) {
        const singleTapParams: OnSingleTapParams = {
          x: event.x,
          y: event.y,
          absoluteX: event.absoluteX,
          absoluteY: event.absoluteY,
        }

        scheduleOnRN(onSingleTap, singleTapParams)
      }
    },
  })


  const singleTapGesture = useMemo(() => ({
    singleTapGesture: tapGesture,
  }), [tapGesture])


  return singleTapGesture
}
