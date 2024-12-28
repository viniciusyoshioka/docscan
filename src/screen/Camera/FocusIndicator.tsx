import { forwardRef, useImperativeHandle, useState } from "react"
import { StyleSheet, View, ViewProps } from "react-native"


export const FOCUS_INDICATOR_SIZE = 56


export interface FocusIndicatorProps extends ViewProps {}


export type FocusIndicatorPos = {
  x: number
  y: number
}


export interface FocusIndicatorRef {
  setFocusPos: (pos: FocusIndicatorPos) => void
  setIsFocusing: (isFocusing: boolean) => void
}


export const FocusIndicator = forwardRef<FocusIndicatorRef, FocusIndicatorProps>((
  props,
  ref
) => {


  const [pos, setPos] = useState<FocusIndicatorPos>({ x: 0, y: 0 })
  const [isFocusing, setIsFocusing] = useState(false)


  useImperativeHandle(ref, () => ({
    setFocusPos: setPos,
    setIsFocusing: setIsFocusing,
  }))


  if (!isFocusing) return null


  return (
    <View
      {...props}
      style={[
        styles.indicator,
        {
          transform: [
            { translateX: pos.x - (FOCUS_INDICATOR_SIZE / 2) },
            { translateY: pos.y - (FOCUS_INDICATOR_SIZE / 2) },
          ],
        },
        props.style,
      ]}
    />
  )
})


const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: FOCUS_INDICATOR_SIZE,
    height: FOCUS_INDICATOR_SIZE,
    borderRadius: FOCUS_INDICATOR_SIZE,
    borderWidth: 1,
    borderColor: "white",
  },
})
