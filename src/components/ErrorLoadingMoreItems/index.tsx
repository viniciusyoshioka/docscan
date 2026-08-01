import Color from 'color'
import { View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import { Pressable } from 'react-native-paper-towel'

import { useLocale } from '@locale'
import { useAppTheme } from '@theme'
import { styles } from './styles.ts'


interface ErrorLoadingMoreItemsProps {
  title: string
  tryAgain: () => void
}


export function ErrorLoadingMoreItems(props: ErrorLoadingMoreItemsProps) {


  const { t } = useLocale()
  const { colors, shape, state } = useAppTheme()


  const rippleColor = Color(colors.onErrorContainer)
    .alpha(state.press)
    .rgb()
    .toString()

  const buttonStyle = {
    ...styles.button,
    backgroundColor: colors.errorContainer,
    borderRadius: shape.large,
  }

  const titleStyle = {
    ...styles.title,
    color: colors.onErrorContainer,
  }

  const textStyle = {
    color: colors.onErrorContainer,
  }


  return (
    <View style={styles.container}>
      <Pressable
        style={buttonStyle}
        android_ripple={{ color: rippleColor }}
        onPress={props.tryAgain}
      >
        <View style={styles.titleContainer}>
          <Icon
            source={'alert-circle-outline'}
            size={18}
            color={colors.onErrorContainer}
          />

          <Text variant={'bodyMedium'} style={titleStyle}>
            {props.title}
          </Text>
        </View>

        <Text variant={'bodyMedium'} style={textStyle}>
          {t('clickHereToTryAgain')}
        </Text>
      </Pressable>
    </View>
  )
}
