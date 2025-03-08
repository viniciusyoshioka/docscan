import { PICTURE_ITEM_MARGIN } from "../constants"


export function getPictureItemSize(windowWidth: number, columnCount: number): number {
  const marginSizeOnBothSides = 2 * PICTURE_ITEM_MARGIN

  const windowWithWithoutMargin = windowWidth - marginSizeOnBothSides
  const pictureItemWidthWithMargin = windowWithWithoutMargin / columnCount
  const pictureItemWidthWithoutMargin = pictureItemWidthWithMargin - marginSizeOnBothSides

  return pictureItemWidthWithoutMargin
}
