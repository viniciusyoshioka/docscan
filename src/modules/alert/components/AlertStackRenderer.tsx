import { memo, useMemo } from 'react'

import type { AlertItemData } from '../alert.types.ts'
import { AlertType } from '../alert.types.ts'
import { Alert } from './Alert.tsx'
import { LoadingAlert } from './LoadingAlert.tsx'


interface AlertStackRendererProps {
  alertStack: AlertItemData<AlertType>[]
}


export const AlertStackRenderer = memo((props: AlertStackRendererProps) => {
  const { alertStack } = props


  const AlertStackItems = useMemo(() => {
    return alertStack.map(alertStackItem => {
      if (alertStackItem.type === AlertType.LOADING) {
        return (
          <LoadingAlert
            key={alertStackItem.id}
            alertStackItem={alertStackItem}
          />
        )
      }

      return (
        <Alert
          key={alertStackItem.id}
          alertStackItem={alertStackItem}
        />
      )
    })
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
