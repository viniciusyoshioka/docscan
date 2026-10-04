import { StyleSheet } from 'react-native'

import { SETTINGS_BUTTON_SIZE } from '../SettingsButton'


export const styles = StyleSheet.create({
  scrim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    zIndex: 1,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    maxHeight: 1.5 * SETTINGS_BUTTON_SIZE,
  },
  contentWrapper: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
