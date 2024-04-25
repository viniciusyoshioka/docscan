import { useWindowDimensions } from "react-native"


export function useColumnCount(): number {


  const { width, height } = useWindowDimensions()

  const VERTICAL_COLUMN_COUNT = 2
  const HORIZONTAL_COLUMN_COUNT = 4


  return (width < height) ? VERTICAL_COLUMN_COUNT : HORIZONTAL_COLUMN_COUNT
}
