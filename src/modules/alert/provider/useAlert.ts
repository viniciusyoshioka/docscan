import { useContext } from 'react'

import type { UseAlert } from '../alert.types.ts'
import { AlertContext } from './alert.context.ts'


export function useAlert(): UseAlert {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error(
      'No value returned for useAlert. Probably AlertProvider is missing',
    )
  }

  return context
}
