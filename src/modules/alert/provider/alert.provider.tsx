import type { PropsWithChildren } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { v4 as UUIDv4 } from 'uuid'

import type {
  AlertId,
  AlertItemData,
  CreateAlertItemParam,
  ShowAlertItemParam,
  UseAlert,
} from '../alert.types.ts'
import { AlertType } from '../alert.types.ts'
import { AlertStackRenderer } from '../components'
import { AlertContext } from './alert.context.ts'


interface AlertProviderProps extends PropsWithChildren {}


export function AlertProvider(props: AlertProviderProps) {


  const [alertStack, setAlertStack] = useState<AlertItemData<AlertType>[]>([])


  const createAlertItem = useCallback(
    <T extends AlertType | undefined>(
      alertItem: CreateAlertItemParam<T>,
    ):(
      T extends AlertType ? AlertItemData<T> : AlertItemData<AlertType.NEUTRAL>
    ) => {
      const createdAlertItem: (
        T extends AlertType
          ? AlertItemData<T>
          : AlertItemData<AlertType.NEUTRAL>
      ) = (
        alertItem.type
          ? {
              ...alertItem,
              id: UUIDv4(),
            }
          : {
              ...alertItem,
              id: UUIDv4(),
              type: AlertType.NEUTRAL,
            }
      ) as (
        T extends AlertType
          ? AlertItemData<T>
          : AlertItemData<AlertType.NEUTRAL>
      )

      return createdAlertItem
    },
    [],
  )


  const create = useCallback(
    <T extends AlertType | undefined>(
      alertItem: CreateAlertItemParam<T>,
    ): (
      T extends AlertType ? AlertItemData<T> : AlertItemData<AlertType.NEUTRAL>
    ) => {
      return createAlertItem(alertItem)
    },
    [createAlertItem],
  )


  const show = useCallback(
    <T extends AlertType | undefined>(
      alertItem: ShowAlertItemParam<T>,
    ): (
      T extends AlertType ? AlertItemData<T> : AlertItemData<AlertType.NEUTRAL>
    ) => {
      const alertItemToShow = alertItem.id
        ? alertItem as (
          T extends AlertType
            ? AlertItemData<T>
            : AlertItemData<AlertType.NEUTRAL>
        )
        : createAlertItem(
            alertItem as CreateAlertItemParam<T>,
          )

      setAlertStack(previousAlertStack => [
        ...previousAlertStack,
        alertItemToShow,
      ])

      return alertItemToShow
    },
    [createAlertItem],
  )


  const dismiss = useCallback((id: AlertId) => {
    setAlertStack(previousAlertStack => {
      const newAlertStack = previousAlertStack.filter(
        previousAlertStackItem => previousAlertStackItem.id !== id,
      )

      return newAlertStack
    })
  }, [])


  const useAlertFunctions = useMemo<UseAlert>(() => ({
    create,
    show,
    dismiss,
  }), [create, show, dismiss])


  return (
    <AlertContext.Provider value={useAlertFunctions}>
      {props.children}

      <AlertStackRenderer alertStack={alertStack} />
    </AlertContext.Provider>
  )
}
