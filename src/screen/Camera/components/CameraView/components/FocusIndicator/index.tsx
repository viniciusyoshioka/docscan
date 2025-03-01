import { forwardRef, useImperativeHandle, useState } from "react"
import { View } from "react-native"

import { FOCUS_INDICATOR_SIZE } from "./constants"
import { styles } from "./styles"


export * from "./constants"


type Position = {
  x: number
  y: number
}


interface FocusIndicatorProps {}


export interface FocusIndicatorRef {
  setPosition: (newPosition: Position) => void
  setIsFocusing: (newIsFocusing: boolean) => void
}


export const FocusIndicator = forwardRef<FocusIndicatorRef, FocusIndicatorProps>((props, ref) => {


  const [isFocusing, setIsFocusing] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })


  useImperativeHandle(ref, () => ({
    setPosition: newPosition => setPosition(newPosition),
    setIsFocusing: newIsFocusing => setIsFocusing(newIsFocusing),
  }))


  return (
    <View
      style={[
        styles.indicator,
        {
          display: isFocusing ? "flex" : "none",
          transform: [
            { translateX: position.x - (FOCUS_INDICATOR_SIZE / 2) },
            { translateY: position.y - (FOCUS_INDICATOR_SIZE / 2) },
          ],
        },
      ]}
    />
  )
})
