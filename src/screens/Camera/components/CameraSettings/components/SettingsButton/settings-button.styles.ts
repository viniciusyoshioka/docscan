import { StyleSheet } from 'react-native'

import { SETTINGS_BUTTON_SIZE } from './settings-button.constants.ts'


export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SETTINGS_BUTTON_SIZE,
    height: SETTINGS_BUTTON_SIZE,
    padding: 8,
  },
})
