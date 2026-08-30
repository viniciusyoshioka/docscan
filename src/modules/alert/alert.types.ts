import type { SetOptional } from 'type-fest'

import type { Brand } from '@types'


export type AlertId = Brand<string, 'alertId'>


export enum AlertType {
  NEUTRAL = 'NEUTRAL',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  LOADING = 'LOADING',
}


export interface AlertButtonOnPressParams {
  dismiss: () => void
}

export type AlertButtonOnPress = (params: AlertButtonOnPressParams) => void

export interface AlertButton {
  label: string
  onPress: AlertButtonOnPress
}


type LoadingAlertItemData<T extends AlertType.LOADING> = {
  id: AlertId
  type: T
  description: string
}

type GenericAlertItemData<T extends AlertType> = {
  id: AlertId
  type: T
  icon?: string
  title: string
  description?: string
  buttons?: AlertButton[]
}

export type AlertItemData<T extends AlertType> = T extends AlertType.LOADING
  ? LoadingAlertItemData<T>
  : GenericAlertItemData<T>


export type CreateAlertItemParam<T extends AlertType | undefined> =
  T extends AlertType
    ? Omit<
      SetOptional<AlertItemData<T>, 'type'>,
      'id'
    >
    : Omit<
      SetOptional<AlertItemData<AlertType.NEUTRAL>, 'type'>,
      'id'
    >

export type ShowAlertItemParam<T extends AlertType | undefined> =
  T extends AlertType
    ? SetOptional<
      AlertItemData<T>,
      'id' | 'type'
    >
    : SetOptional<
      AlertItemData<AlertType.NEUTRAL>,
      'id' | 'type'
    >


export interface UseAlert {
  create: <T extends AlertType | undefined>(
    data: CreateAlertItemParam<T>,
  ) => (
    T extends AlertType
      ? AlertItemData<T>
      : AlertItemData<AlertType.NEUTRAL>
  )

  show: <T extends AlertType | undefined>(
    data: ShowAlertItemParam<T>,
  ) => (
    T extends AlertType
      ? AlertItemData<T>
      : AlertItemData<AlertType.NEUTRAL>
  )

  dismiss: (id: AlertId) => void
}
