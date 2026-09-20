import type { SharedValue } from 'react-native-reanimated'
import { useSharedValue } from 'react-native-reanimated'


export interface ImageTransformData {
  zoom: SharedValue<number>
  savedZoom: SharedValue<number>

  initialFocalX: SharedValue<number>
  initialFocalY: SharedValue<number>
  focalX: SharedValue<number>
  focalY: SharedValue<number>

  initialTranslateX: SharedValue<number>
  initialTranslateY: SharedValue<number>
  translateX: SharedValue<number>
  translateY: SharedValue<number>
}


export function useImageTransformData(): ImageTransformData {


  const zoom = useSharedValue(1)
  const savedZoom = useSharedValue(1)

  const initialFocalX = useSharedValue(0)
  const initialFocalY = useSharedValue(0)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

  const initialTranslateX = useSharedValue(0)
  const initialTranslateY = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)


  return {
    zoom: zoom,
    savedZoom: savedZoom,
    initialFocalX,
    initialFocalY,
    focalX,
    focalY,
    initialTranslateX,
    initialTranslateY,
    translateX,
    translateY,
  }
}
