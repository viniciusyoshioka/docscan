import { forwardRef, useImperativeHandle } from "react"
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated"

import { styles } from "./styles"


interface PictureTakenFeedbackProps {}


export interface PictureTakenFeedbackRef {
  showFeedback: () => void
}


export const PictureTakenFeedback = forwardRef<PictureTakenFeedbackRef, PictureTakenFeedbackProps>((
  props,
  ref,
) => {


  const viewOpacity = useSharedValue(0)


  useImperativeHandle(ref, () => ({
    showFeedback,
  }))


  function showFeedback() {
    viewOpacity.value = withSequence(
      withSpring(1, { duration: 50 }),
      withSpring(0, { duration: 50 }),
    )
  }


  const animatedStyle = useAnimatedStyle(() => ({
    ...styles.container,
    opacity: viewOpacity.value,
  }))


  return <Reanimated.View style={animatedStyle} />
})
