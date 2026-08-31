import { StyleSheet } from 'react-native'

import { PICTURE_ITEM_MARGIN } from './constants.ts'


export const styles = StyleSheet.create({
  pictureButton: {
    margin: PICTURE_ITEM_MARGIN,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    aspectRatio: 1,
    resizeMode: 'cover',
  },
})
