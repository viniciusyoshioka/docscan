import Color from 'color'
import type { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { Button, Icon, Text } from 'react-native-paper'

import { useLocale } from '@locale'
import { useAppTheme } from '@theme'
import { styles } from './styles.ts'


interface ErrorLoadingListProps {
  description: string
  tryAgain: () => Promise<void>
}


export function ErrorLoadingList(props: ErrorLoadingListProps) {


  const { t } = useLocale()
  const { colors, shape, state } = useAppTheme()


  const rippleColor = Color(colors.onErrorContainer)
    .alpha(state.press)
    .rgb()
    .toString()

  const errorContainerStyle: StyleProp<ViewStyle> = {
    ...styles.errorContainer,
    backgroundColor: colors.errorContainer,
    borderRadius: shape.large,
  }

  const titleStyle: StyleProp<TextStyle> = {
    ...styles.title,
    color: colors.onErrorContainer,
  }

  const textStyle: StyleProp<TextStyle> = {
    color: colors.onErrorContainer,
  }


  return (
    <View style={styles.container}>
      <View style={errorContainerStyle}>
        <View style={styles.titleContainer}>
          <Icon
            source={'alert-circle-outline'}
            size={24}
            color={colors.onErrorContainer}
          />

          <Text variant={'titleMedium'} style={titleStyle}>
            {t('error')}
          </Text>
        </View>

        <Text variant={'bodyLarge'} style={textStyle}>
          {props.description}
        </Text>

        <Button
          mode={'text'}
          rippleColor={rippleColor}
          onPress={props.tryAgain}
        >
          <Text variant={'bodyLarge'} style={textStyle}>
            {t('tryAgain')}
          </Text>
        </Button>
      </View>
    </View>
  )
}
