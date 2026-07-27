import { createContext } from 'react'

import type { UseAlert } from '../alert.types.ts'


export const AlertContext = createContext<UseAlert | null>(null)
