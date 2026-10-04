import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native'

import { useAppTheme } from '@theme'
import { styles } from './settings-modal.styles.ts'


export interface SettingsModalProps extends PropsWithChildren {
  isVisible: boolean
  onRequestClose: () => void
  cameraControlHeight: number
}


export function SettingsModal(props: SettingsModalProps) {
  const { cameraControlHeight, isVisible, onRequestClose, children } = props


  const { shape } = useAppTheme()


  const containerStyle = useMemo<ViewStyle>(() => ({
    ...styles.container,
    borderRadius: shape.medium,
  }), [shape])


  if (!isVisible) {
    return null
  }


  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onRequestClose}
      style={styles.scrim}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[
          containerStyle,
          { marginBottom: cameraControlHeight },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.contentWrapper}
            children={children}
          />
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}
