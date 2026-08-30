import { memo, useCallback, useMemo } from 'react'
import type { StyleProp, TextStyle } from 'react-native'
import { Button, Dialog, Text } from 'react-native-paper'

import { useLocale } from '@locale'
import type { AlertButton, AlertItemData, AlertType } from '../alert.types.ts'
import { useAlert } from '../provider'


interface AlertProps {
  alertStackItem: AlertItemData<
    Exclude<AlertType, AlertType.LOADING>
  >
}


// TODO: Implement UI changes for type variants
export const Alert = memo((props: AlertProps) => {
  const { alertStackItem } = props

  const { id, icon, title, description, type, buttons } = alertStackItem


  const alert = useAlert()
  const { t } = useLocale()


  const titleStyle = useMemo<StyleProp<TextStyle>>(() => {
    if (!icon) return undefined

    return {
      textAlign: 'center',
    }
  }, [icon])


  const dismissItself = useCallback(() => {
    alert.dismiss(id)
  }, [alert, id])


  const AlertButton = useCallback((params: { alertButton: AlertButton }) => {
    const { alertButton } = params

    const onPress = () => {
      alertButton.onPress({
        dismiss: dismissItself,
      })
    }

    return (
      <Button onPress={onPress}>
        {alertButton.label}
      </Button>
    )
  }, [dismissItself])


  const buttonsToShow = useMemo<AlertButton[]>(() => {
    if (buttons) return buttons

    return [
      {
        label: t('ok'),
        onPress: dismissItself,
      },
    ]
  }, [buttons, t, dismissItself])


  return (
    <Dialog visible={true} onDismiss={dismissItself}>
      {icon && (
        <Dialog.Icon icon={icon} />
      )}

      <Dialog.Title style={titleStyle}>
        {title}
      </Dialog.Title>

      {description && (
        <Dialog.Content>
          <Text variant={'bodyMedium'}>
            {description}
          </Text>
        </Dialog.Content>
      )}

      <Dialog.Actions>
        {buttonsToShow.map((button, index) => (
          <AlertButton key={index} alertButton={button} />
        ))}
      </Dialog.Actions>
    </Dialog>
  )
})
