import { Easing, WithTimingConfig } from "react-native-reanimated"


export const ANIMATION_DURATION = 150


export const TIMING_CONFIG: WithTimingConfig = {
    duration: ANIMATION_DURATION,
    easing: Easing.linear,
}
