import { Platform } from 'react-native'
import type { PermissionStatus } from 'react-native-permissions'
import {
  check,
  checkNotifications,
  PERMISSIONS,
  request,
  requestNotifications,
} from 'react-native-permissions'

import type { ResultArray } from '@types'
import { normalizeError } from '@utils'
import {
  BasePermissionError,
  PermissionCheckInvalidPlatformError,
  UnexpectedPermissionError,
} from './errors'
import type {
  PermissionOptions,
  PermissionResponse,
} from './permission-manager.types.ts'
import { Permissions } from './permission-manager.types.ts'
import type { NativePermission } from './permission-mapping'
import { PermissionMapping } from './permission-mapping'


export class PermissionManager {


  static async hasPermission<P extends Permissions = Permissions>(
    permission: P,
    options: PermissionOptions<P>,
  ): Promise<ResultArray<PermissionResponse, BasePermissionError>> {
    try {
      const response = await this._hasPermission(permission, options)
      return [response, null]
    } catch (error) {
      if (error instanceof BasePermissionError) {
        return [null, error]
      }

      const errorInstance = normalizeError(error)

      const unexpectedPermissionError = new UnexpectedPermissionError(
        `An unexpected error occurred while checking permission ${permission}: "${errorInstance.message}"`,
      )
      unexpectedPermissionError.stack = errorInstance.stack
      return [null, unexpectedPermissionError]
    }
  }

  private static async _hasPermission<P extends Permissions = Permissions>(
    permission: P,
    options: PermissionOptions<P>,
  ): Promise<PermissionResponse> {
    const nativePermission = PermissionMapping.mapPermissionToNativePermission(
      permission,
      options,
    )

    if (!nativePermission) {
      const specificResponse = await this.checkSpecificPermission(permission)
      if (specificResponse) return specificResponse

      throw new UnexpectedPermissionError(
        `Permission ${permission} was not checked correctly. This should not happen`,
      )
    }

    const shouldIgnore = this.shouldIgnorePermission(
      permission,
      nativePermission,
    )
    if (shouldIgnore) {
      return this.buildPermissionResponseForIgnoredPermission()
    }

    const permissionStatus = await check(nativePermission)
    return this.buildPermissionResponse(permissionStatus)
  }

  private static async checkSpecificPermission(
    permission: Permissions,
  ): Promise<PermissionResponse | null> {
    if (permission === Permissions.NOTIFICATION) {
      return await this.checkNotificationPermission()
    }

    return null
  }

  private static async checkNotificationPermission():
  Promise<PermissionResponse> {
    const notificationResponse = await checkNotifications()
    return this.buildPermissionResponse(notificationResponse.status)
  }


  static async requestPermission<P extends Permissions = Permissions>(
    permission: P,
    options: PermissionOptions<P>,
  ): Promise<ResultArray<PermissionResponse, BasePermissionError>> {
    try {
      const response = await this._requestPermission(permission, options)
      return [response, null]
    } catch (error) {
      if (error instanceof BasePermissionError) {
        return [null, error]
      }

      const errorInstance = normalizeError(error)

      const unexpectedPermissionError = new UnexpectedPermissionError(
        `An unexpected error occurred while requesting permission ${permission}: "${errorInstance.message}"`,
      )
      unexpectedPermissionError.stack = errorInstance.stack
      return [null, unexpectedPermissionError]
    }
  }

  private static async _requestPermission<P extends Permissions = Permissions>(
    permission: P,
    options: PermissionOptions<P>,
  ): Promise<PermissionResponse> {
    const nativePermission = PermissionMapping.mapPermissionToNativePermission(
      permission,
      options,
    )

    if (!nativePermission) {
      const specificResponse = await this.requestSpecificPermission(permission)
      if (specificResponse) return specificResponse

      throw new UnexpectedPermissionError(
        `Permission ${permission} was not requested correctly. This should not happen`,
      )
    }

    const shouldIgnore = this.shouldIgnorePermission(
      permission,
      nativePermission,
    )
    if (shouldIgnore) {
      return this.buildPermissionResponseForIgnoredPermission()
    }

    const permissionStatus = await request(nativePermission)
    return this.buildPermissionResponse(permissionStatus)
  }

  private static async requestSpecificPermission(
    permission: Permissions,
  ): Promise<PermissionResponse | null> {
    if (permission === Permissions.NOTIFICATION) {
      return await this.requestNotificationPermission()
    }

    return null
  }

  private static async requestNotificationPermission():
  Promise<PermissionResponse> {
    const notificationResponse = await requestNotifications()
    return this.buildPermissionResponse(notificationResponse.status)
  }


  private static isPermissionGranted(
    permissionStatus: PermissionStatus,
  ): boolean {
    const permissionGranted: PermissionStatus[] = [
      'granted',
      'limited',
    ]

    return permissionGranted.includes(permissionStatus)
  }

  private static canRequestPermission(
    permissionStatus: PermissionStatus,
  ): boolean {
    return permissionStatus === 'denied'
  }


  private static buildPermissionResponse(
    permissionStatus: PermissionStatus,
  ): PermissionResponse {
    const isGranted = this.isPermissionGranted(permissionStatus)
    if (isGranted) {
      return {
        isGranted: true,
        canRequest: true,
      }
    }

    const canRequest = this.canRequestPermission(permissionStatus)
    if (canRequest) {
      return {
        isGranted: false,
        canRequest: true,
      }
    }

    return {
      isGranted: false,
      canRequest: false,
    }
  }

  private static buildPermissionResponseForIgnoredPermission():
  PermissionResponse {
    return {
      isGranted: true,
      canRequest: true,
    }
  }


  private static shouldIgnorePermission(
    permission: Permissions,
    nativePermission: NativePermission,
  ): boolean {
    switch (Platform.OS) {
      case 'android':
        return this.shouldIgnorePermissionForAndroid(
          permission,
          nativePermission,
        )
      case 'ios':
        return this.shouldIgnorePermissionForIos(
          permission,
          nativePermission,
        )
      default:
        throw new UnexpectedPermissionError(
          `Unsupported platform ${Platform.OS}. This should not happen`,
        )
    }
  }

  private static shouldIgnorePermissionForAndroid(
    permission: Permissions,
    nativePermission: NativePermission,
  ): boolean {
    if (Platform.OS !== 'android') {
      throw new PermissionCheckInvalidPlatformError(
        'Expected platform to be Android when calling shouldIgnorePermissionForAndroid',
      )
    }

    if (permission === Permissions.READ_STORAGE) {
      switch (nativePermission) {
        case PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE: {
          const shouldIgnore = Platform.Version >= 33
          return shouldIgnore
        }

        case PERMISSIONS.ANDROID.READ_MEDIA_IMAGES:
        case PERMISSIONS.ANDROID.READ_MEDIA_VIDEO:
        case PERMISSIONS.ANDROID.READ_MEDIA_AUDIO: {
          const shouldIgnore = Platform.Version < 33
          return shouldIgnore
        }

        default:
          return false
      }
    }

    if (permission === Permissions.WRITE_STORAGE) {
      const isWriteExternalStorage =
        nativePermission === PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      if (isWriteExternalStorage) {
        const shouldIgnore = Platform.Version >= 33
        return shouldIgnore
      }

      return false
    }

    return false
  }

  private static shouldIgnorePermissionForIos(
    permission: Permissions,
    nativePermission: NativePermission,
  ): boolean {
    return false
  }
}
