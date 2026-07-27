import type { TextStyle } from 'react-native'

import { FontFamily, FontWeight } from './fonts.constants.ts'


function mapJetBrainsMono(fontWeight: FontWeight): TextStyle {
  switch (fontWeight) {
    case FontWeight.BOLD:
      return {
        fontFamily: 'JetBrainsMonoBold',
        fontWeight: 'regular',
      }
    case FontWeight.ITALIC:
      return {
        fontFamily: 'JetBrainsMonoItalic',
        fontWeight: 'regular',
      }
    case FontWeight.BOLD_ITALIC:
      return {
        fontFamily: 'JetBrainsMonoBoldItalic',
        fontWeight: 'regular',
      }
    case FontWeight.REGULAR:
    default:
      fontWeight satisfies FontWeight.REGULAR
      return {
        fontFamily: 'JetBrainsMonoRegular',
        fontWeight: 'regular',
      }
  }
}


export function fontFamilyMapper(
  fontFamily: FontFamily,
  fontWeight: FontWeight,
): TextStyle {
  switch (fontFamily) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case FontFamily.JETBRAINS_MONO:
      return mapJetBrainsMono(fontWeight)
    default:
      fontFamily satisfies never
      return {}
  }
}
