import { useEffect } from "react"
import { OrientationType } from "react-native-orientation-locker"
import { SharedValue, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"

import { useDeviceOrientation } from "@hooks"


// TODO: Fix rotation to move to the same direction as the device.
// Save previous orientation and compare with the new one.
// Use state machine to move through the correct rotation.
// TODO: To avoid too high or too low numbers, when reach a number
// divisible by 360, set the variable back to 0, after the animation has finished.
export function useAnimatedRotationDegree(): SharedValue<number> {


  const deviceOrientation = useDeviceOrientation()

  const rotationDegree = useSharedValue(0)
  const animatedRotationDegree = useDerivedValue(() => (
    withTiming(rotationDegree.value, { duration: 200 })
  ))


  useEffect(() => {
    switch (deviceOrientation) {
      case OrientationType["PORTRAIT"]:
        if (rotationDegree.value === 90) {
          rotationDegree.value -= 90
        } else if (rotationDegree.value === 270) {
          rotationDegree.value += 90
        } else {
          rotationDegree.value = 0
        }
        break
      case OrientationType["PORTRAIT-UPSIDEDOWN"]:
        if (rotationDegree.value === 90) {
          rotationDegree.value += 90
        } else if (rotationDegree.value === 270) {
          rotationDegree.value -= 90
        } else {
          rotationDegree.value = 180
        }
        break
      case OrientationType["LANDSCAPE-LEFT"]:
        if (rotationDegree.value === 0) {
          rotationDegree.value += 90
        } else if (rotationDegree.value === 180) {
          rotationDegree.value -= 90
        } else {
          rotationDegree.value = 90
        }
        break
      case OrientationType["LANDSCAPE-RIGHT"]:
        if (rotationDegree.value === 0) {
          rotationDegree.value -= 90
        } else if (rotationDegree.value === 180) {
          rotationDegree.value += 90
        } else {
          rotationDegree.value = 270
        }
        break
      default:
        break
    }
  }, [deviceOrientation])


  return animatedRotationDegree
}
