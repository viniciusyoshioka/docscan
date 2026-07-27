import { memo, useMemo } from 'react'

import type { AlertItemData } from '../alert.types.ts'
import { Alert } from './Alert.tsx'


interface AlertStackRendererProps {
  alertStack: AlertItemData[]
}


export const AlertStackRenderer = memo((props: AlertStackRendererProps) => {
  const { alertStack } = props


  const AlertStackItems = useMemo(() => {
    return alertStack.map(alertStackItem => (
      <Alert
        key={alertStackItem.id}
        alertStackItem={alertStackItem}
      />
    ))
  }, [alertStack])


  if (!alertStack.length) {
    return null
  }

  return (
    <>
      {AlertStackItems}
    </>
  )
})
