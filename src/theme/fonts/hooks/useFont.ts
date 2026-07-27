import { useMemo } from 'react'
import type { TextStyle } from 'react-native'

import { fontFamilyMapper } from '../font-family-mapper.ts'
import { FontFamily, FontWeight } from '../fonts.constants.ts'


export function useFont(
  fontFamily: FontFamily = FontFamily.JETBRAINS_MONO,
  fontWeight: FontWeight = FontWeight.REGULAR,
): TextStyle {


  const fontStyle = useMemo((): TextStyle => {
    return fontFamilyMapper(fontFamily, fontWeight)
  }, [fontFamily, fontWeight])


  return fontStyle
}
