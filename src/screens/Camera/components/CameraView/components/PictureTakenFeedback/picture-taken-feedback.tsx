import { forwardRef, useImperativeHandle } from 'react'
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

import { styles } from './picture-taken-feedback.styles.ts'


interface PictureTakenFeedbackProps {}


export interface PictureTakenFeedbackRef {
  showFeedback: () => void
}


export const PictureTakenFeedback = forwardRef<
  PictureTakenFeedbackRef,
  PictureTakenFeedbackProps
>((props, ref) => {


  const viewOpacity = useSharedValue(0)


  function showFeedback() {
    viewOpacity.value = withSequence(
      withSpring(1, { duration: 50 }),
      withSpring(0, { duration: 50 }),
    )
  }


  useImperativeHandle(
    ref,
    () => ({
      showFeedback,
    }),
    [],
  )


  const animatedStyle = useAnimatedStyle(() => ({
    ...styles.container,
    opacity: viewOpacity.value,
  }))


  return <Reanimated.View style={animatedStyle} />
})
