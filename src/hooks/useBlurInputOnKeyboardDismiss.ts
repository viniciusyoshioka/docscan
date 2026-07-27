import type { RefObject } from 'react'
import { useCallback } from 'react'
import type { TextInput } from 'react-native'

import { useKeyboard } from './useKeyboard.ts'


export function useBlurInputOnKeyboardDismiss(
  ...inputs: RefObject<TextInput | null>[]
) {


  const blurInputs = useCallback(() => {
    inputs.forEach(input => {
      input.current?.blur()
    })
  }, inputs)


  useKeyboard('keyboardDidHide', blurInputs)
}
