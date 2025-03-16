import { createStyleSheet } from "react-native-unistyles"


export const stylesheet = createStyleSheet({
  imageItemButton: (imageItemSize: number) => ({
    alignItems: "center",
    justifyContent: "center",
    width: imageItemSize,
    aspectRatio: 1,
  }),
  image: (imageItemSize: number) => ({
    width: imageItemSize,
    aspectRatio: 1,
  }),
})
