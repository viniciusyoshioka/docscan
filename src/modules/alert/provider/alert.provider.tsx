import type { PropsWithChildren } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { v4 as UUIDv4 } from 'uuid'

import type { AlertItemData, UseAlert } from '../alert.types.ts'
import { AlertStackRenderer } from '../components'
import { AlertContext } from './alert.context.ts'


interface AlertProviderProps extends PropsWithChildren {}


export function AlertProvider(props: AlertProviderProps) {


  const [alertStack, setAlertStack] = useState<AlertItemData[]>([])


  const show = useCallback((alertStackItemWithoutId: Omit<AlertItemData, 'id'>) => {
    setAlertStack(previousAlertStack => {
      const alertStackItem: AlertItemData = {
        ...alertStackItemWithoutId,
        id: UUIDv4(),
      }

      return [
        ...previousAlertStack,
        alertStackItem,
      ]
    })
  }, [])


  const dismiss = useCallback((id: string) => {
    setAlertStack(previousAlertStack => {
      const newAlertStack = previousAlertStack.filter(
        previousAlertStackItem => previousAlertStackItem.id !== id,
      )

      return newAlertStack
    })
  }, [])


  const useAlertFunctions = useMemo<UseAlert>(() => ({
    show,
    dismiss,
  }), [show, dismiss])


  return (
    <AlertContext.Provider value={useAlertFunctions}>
      {props.children}

      <AlertStackRenderer alertStack={alertStack} />
    </AlertContext.Provider>
  )
}
