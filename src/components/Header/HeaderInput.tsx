import { forwardRef, useMemo } from 'react'
import type { StyleProp, TextInputProps, TextStyle } from 'react-native'
import { TextInput } from 'react-native'

import { useAppTheme } from '@theme'


interface HeaderInputProps extends TextInputProps {}


export const HeaderInput = forwardRef<TextInput, HeaderInputProps>(
  (props, ref) => {


    const { colors, typography } = useAppTheme()


    const headerInputStyle = useMemo((): StyleProp<TextStyle> => ({
      flex: 1,
      color: colors.onSurface,
      ...typography.title.large,
      padding: 0,
    }), [colors, typography])

    const style = useMemo((): StyleProp<TextStyle> => ([
      headerInputStyle,
      props.style,
    ]), [headerInputStyle, props.style])


    return (
      <TextInput
        ref={ref}
        submitBehavior={'blurAndSubmit'}
        placeholderTextColor={colors.onSurfaceVariant}
        selectionColor={colors.primaryContainer}
        cursorColor={colors.primary}
        selectTextOnFocus={true}
        {...props}
        style={style}
      />
    )
  },
)
