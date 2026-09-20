import { useMemo } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import { Appbar } from 'react-native-paper'

import { useAppTheme } from '@theme'
import { styles } from './styles.ts'


export interface RotationOptions {
  isActive: boolean
  open: () => void
  exit: () => void
  save: () => void
  rotateLeft: () => void
  rotateRight: () => void
}


export interface CropOptions {
  isActive: boolean
  open: () => void
  exit: () => void
  save: () => void
}


interface PictureDetailHeaderProps {
  isVisible: boolean
  goBack: () => void
  replacePicture: () => void
  rotation: RotationOptions
  crop: CropOptions
}


export function PictureDetailHeader(props: PictureDetailHeaderProps) {


  const { isDark } = useAppTheme()


  const { headerColor, iconColor } = useMemo(() => {
    const headerColor = isDark
      ? 'rgba(0, 0, 0, 0.4)'
      : 'rgba(255, 255, 255, 0.4)'
    const iconColor = isDark
      ? 'white'
      : 'black'

    return { headerColor, iconColor }
  }, [isDark])

  const absoluteStyle = useMemo<StyleProp<ViewStyle>>(() => ({
    ...styles.headerAbsolute,
    backgroundColor: headerColor,
  }), [headerColor])


  if (!props.isVisible) return null


  if (props.rotation.isActive) return (
    <Appbar.Header style={styles.headerRelative} statusBarHeight={0}>
      <Appbar.Action
        icon={'close'}
        iconColor={iconColor}
        onPress={props.rotation.exit}
        animated={false}
      />

      <Appbar.Content title={''} />

      <Appbar.Action
        icon={'rotate-left'}
        iconColor={iconColor}
        onPress={props.rotation.rotateLeft}
        animated={false}
      />

      <Appbar.Action
        icon={'rotate-right'}
        iconColor={iconColor}
        onPress={props.rotation.rotateRight}
        animated={false}
      />

      <Appbar.Action
        icon={'check'}
        iconColor={iconColor}
        onPress={props.rotation.save}
        animated={false}
      />
    </Appbar.Header>
  )


  if (props.crop.isActive) return (
    <Appbar.Header style={styles.headerRelative} statusBarHeight={0}>
      <Appbar.Action
        icon={'close'}
        iconColor={iconColor}
        onPress={props.crop.exit}
        animated={false}
      />

      <Appbar.Content title={''} />

      <Appbar.Action
        icon={'check'}
        iconColor={iconColor}
        onPress={props.crop.save}
        animated={false}
      />
    </Appbar.Header>
  )


  return (
    <Appbar.Header style={absoluteStyle} statusBarHeight={0}>
      <Appbar.BackAction
        iconColor={iconColor}
        onPress={props.goBack}
        animated={false}
      />

      <Appbar.Content title={''} />

      <Appbar.Action
        icon={'camera-retake-outline'}
        iconColor={iconColor}
        onPress={props.replacePicture}
        animated={false}
      />

      <Appbar.Action
        icon={'rotate-left'}
        iconColor={iconColor}
        onPress={props.rotation.open}
        animated={false}
      />

      <Appbar.Action
        icon={'crop'}
        iconColor={iconColor}
        onPress={props.crop.open}
        animated={false}
      />
    </Appbar.Header>
  )
}
