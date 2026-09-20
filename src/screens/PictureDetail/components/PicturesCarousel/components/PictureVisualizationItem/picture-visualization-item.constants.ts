import type { WithTimingConfig } from 'react-native-reanimated'
import { Easing } from 'react-native-reanimated'


export const ANIMATION_DURATION_IN_MS = 200


export const LINEAR_TIMING_CONFIG: WithTimingConfig = {
  duration: ANIMATION_DURATION_IN_MS,
  easing: Easing.linear,
}
