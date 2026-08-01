
export enum AlertType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}


export interface AlertButtonOnPressParams {
  dismiss: () => void
}

export type AlertButtonOnPress = (params: AlertButtonOnPressParams) => void

export interface AlertButton {
  label: string
  onPress: AlertButtonOnPress
}


export interface AlertItemData {
  id: string
  icon?: string
  title: string
  description?: string
  type?: AlertType
  buttons?: AlertButton[]
}


export interface UseAlert {
  show: (data: Omit<AlertItemData, 'id'>) => void
  dismiss: (id: string) => void
}
