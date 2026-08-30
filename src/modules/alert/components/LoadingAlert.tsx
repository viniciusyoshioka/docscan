import { memo } from 'react'
import { ActivityIndicator, Dialog, Text } from 'react-native-paper'

import { useAppTheme } from '@theme'
import type { AlertItemData, AlertType } from '../alert.types.ts'


interface LoadingAlertProps {
  alertStackItem: AlertItemData<AlertType.LOADING>
}


export const LoadingAlert = memo((props: LoadingAlertProps) => {
  const { alertStackItem } = props

  const { description } = alertStackItem


  const { colors } = useAppTheme()


  return (
    <Dialog visible={true} dismissable={false}>
      <Dialog.Content
        style={{
          flexDirection: 'row',
          gap: 24,
        }}
      >
        <ActivityIndicator
          size={28}
          color={colors.primary}
        />

        <Text
          variant={'bodyMedium'}
          style={{ flexShrink: 1 }}
        >
          {description}
        </Text>
      </Dialog.Content>
    </Dialog>
  )
})
