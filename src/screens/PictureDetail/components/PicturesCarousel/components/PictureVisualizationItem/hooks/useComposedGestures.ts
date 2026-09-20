import type {
  ComposedGesture,
  PanGesture,
  PinchGesture,
  TapGesture,
} from 'react-native-gesture-handler'
import {
  useCompetingGestures,
  useExclusiveGestures,
  useSimultaneousGestures,
} from 'react-native-gesture-handler'


interface Gestures {
  singleTapGesture: TapGesture
  doubleTapGesture: TapGesture
  pinchGesture: PinchGesture
  panGesture: PanGesture
}


export function useComposedGestures(params: Gestures): ComposedGesture {
  const {
    singleTapGesture,
    doubleTapGesture,
    pinchGesture,
    panGesture,
  } = params


  const exclusiveGestures = useExclusiveGestures(
    doubleTapGesture,
    singleTapGesture,
  )
  const competingGestures = useCompetingGestures(
    pinchGesture,
    exclusiveGestures,
  )
  const simultaneousGestures = useSimultaneousGestures(
    competingGestures,
    panGesture,
  )


  return simultaneousGestures
}
