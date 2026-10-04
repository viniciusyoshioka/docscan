import { StyleSheet } from 'react-native'

import { CAPTURE_BUTTON_SIZE } from './capture-button.constants.ts'


export const styles = StyleSheet.create({
  captureButton: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE,
  },
})
