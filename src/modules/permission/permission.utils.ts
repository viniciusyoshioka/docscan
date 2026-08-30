import { UsePermissionStatus } from './hooks'


export class PermissionUtils {


  private static readonly LOADING_STATUS = new Set([
    UsePermissionStatus.IS_CHECKING,
    UsePermissionStatus.IS_REQUESTING,
  ])
  private static readonly ERROR_STATUS = new Set([
    UsePermissionStatus.ERROR_CHECKING,
    UsePermissionStatus.ERROR_REQUESTING,
  ])
  private static readonly DENIED_STATUS = new Set([
    UsePermissionStatus.DENIED_CANNOT_REQUEST,
    UsePermissionStatus.DENIED_CAN_REQUEST,
  ])


  static isLoading(status: UsePermissionStatus): boolean {
    return this.LOADING_STATUS.has(status)
  }

  static hasError(status: UsePermissionStatus): boolean {
    return this.ERROR_STATUS.has(status)
  }

  static isDenied(status: UsePermissionStatus): boolean {
    return this.DENIED_STATUS.has(status)
  }

  static isGranted(status: UsePermissionStatus): boolean {
    return status === UsePermissionStatus.GRANTED
  }

  static canRequestDenied(status: UsePermissionStatus): boolean {
    const isDenied = PermissionUtils.isDenied(status)
    if (!isDenied) {
      console.warn(
        `Permission status "${status}" is not a denied status to check "canRequestDenied"`,
      )
      return false
    }

    return status === UsePermissionStatus.DENIED_CAN_REQUEST
  }
}
