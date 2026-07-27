import { Platform } from 'react-native'
import { PERMISSIONS } from 'react-native-permissions'

import {
  PermissionCheckInvalidPlatformError,
  UnexpectedPermissionError,
} from '../errors'
import type { PermissionOptions } from '../permission-manager.types.ts'
import {
  MediaType,
  Permissions,
} from '../permission-manager.types.ts'
import type {
  NativePermission,
  PermissionToMapNativePermissionMethodMap,
  PlatformToNativePermissionMap,
  SupportedPlatformTypes,
} from './permission-mapping.types.ts'


const { ANDROID, IOS } = PERMISSIONS


export class PermissionMapping {


  private static readonly platform = this.getPlatform()
  private static readonly permissionToMapNativePermissionMethodMap =
    this.getPermissionToMapNativePermissionMethodMap()


  static mapPermissionToNativePermission<P extends Permissions>(
    permission: P,
    options: PermissionOptions<P>,
  ): NativePermission | null {
    const mapNativePermissionMethod =
      this.permissionToMapNativePermissionMethodMap[permission]

    const nativePermission = mapNativePermissionMethod(options)
    return nativePermission
  }


  // TODO: Change to global getter or assert function
  private static getPlatform(): SupportedPlatformTypes {
    const platform = Platform.OS

    const isAndroid = platform === 'android'
    const isIos = platform === 'ios'

    if (isAndroid || isIos) {
      return platform
    }

    throw new PermissionCheckInvalidPlatformError(
      `Unsupported platform ${platform}`,
    )
  }


  private static getPermissionToMapNativePermissionMethodMap():
  PermissionToMapNativePermissionMethodMap {
    return {
      [Permissions.CAMERA]: this.mapCameraPermission,
      [Permissions.MICROPHONE]: this.mapMicrophonePermission,
      [Permissions.NOTIFICATION]: this.mapNotificationPermission,
      [Permissions.READ_STORAGE]: this.mapReadStoragePermission,
      [Permissions.WRITE_STORAGE]: this.mapWriteStoragePermission,
    }
  }


  private static mapCameraPermission(): NativePermission | null {
    const platformToNativePermissionMap: PlatformToNativePermissionMap = {
      android: ANDROID.CAMERA,
      ios: IOS.CAMERA,
    }

    return platformToNativePermissionMap[this.platform]
  }

  private static mapMicrophonePermission(): NativePermission | null {
    const platformToNativePermissionMap: PlatformToNativePermissionMap = {
      android: ANDROID.RECORD_AUDIO,
      ios: IOS.MICROPHONE,
    }

    return platformToNativePermissionMap[this.platform]
  }

  private static mapNotificationPermission(): NativePermission | null {
    return null
  }

  private static mapReadStoragePermission(
    options: PermissionOptions<Permissions.READ_STORAGE>,
  ): NativePermission | null {
    if (this.platform === 'ios') {
      return this.mapReadStoragePermissionIos(options)
    }
    return this.mapReadStoragePermissionAndroid(options)
  }

  private static mapReadStoragePermissionAndroid(
    options: PermissionOptions<Permissions.READ_STORAGE>,
  ): NativePermission | null {
    const { mediaType } = options

    if (Platform.OS !== 'android') {
      throw new PermissionCheckInvalidPlatformError(
        'Method mapReadStoragePermissionForAndroid must only be called for Android',
      )
    }

    switch (mediaType) {
      case MediaType.ALL:
        return ANDROID.READ_EXTERNAL_STORAGE
      case MediaType.IMAGE:
        if (Platform.Version >= 33) {
          return ANDROID.READ_MEDIA_IMAGES
        }
        return ANDROID.READ_EXTERNAL_STORAGE
      case MediaType.VIDEO:
        if (Platform.Version >= 33) {
          return ANDROID.READ_MEDIA_VIDEO
        }
        return ANDROID.READ_EXTERNAL_STORAGE
      case MediaType.AUDIO:
        if (Platform.Version >= 33) {
          return ANDROID.READ_MEDIA_AUDIO
        }
        return ANDROID.READ_EXTERNAL_STORAGE
      default:
        mediaType satisfies never
        throw new UnexpectedPermissionError(
          `Invalid mediaType ${String(mediaType)}. This should not happen`,
        )
    }
  }

  private static mapReadStoragePermissionIos(
    options: PermissionOptions<Permissions.READ_STORAGE>,
  ): NativePermission | null {
    const { mediaType } = options

    if (Platform.OS !== 'ios') {
      throw new PermissionCheckInvalidPlatformError(
        'Method mapReadStoragePermissionForIos must only be called for iOS',
      )
    }

    switch (mediaType) {
      case MediaType.IMAGE:
        return IOS.PHOTO_LIBRARY
      case MediaType.VIDEO:
      case MediaType.AUDIO:
      case MediaType.ALL:
        return IOS.MEDIA_LIBRARY
      default:
        mediaType satisfies never
        throw new UnexpectedPermissionError(
          `Invalid mediaType ${String(mediaType)}. This should not happen`,
        )
    }
  }

  private static mapWriteStoragePermission(): NativePermission | null {
    if (this.platform === 'ios') {
      return this.mapWriteStoragePermissionIos()
    }
    return this.mapWriteStoragePermissionAndroid()
  }

  private static mapWriteStoragePermissionAndroid(): NativePermission | null {
    if (Platform.OS !== 'android') {
      throw new PermissionCheckInvalidPlatformError(
        'Method mapWriteStoragePermissionForAndroid must only be called for Android',
      )
    }

    return ANDROID.WRITE_EXTERNAL_STORAGE
  }

  private static mapWriteStoragePermissionIos(): NativePermission | null {
    if (Platform.OS !== 'ios') {
      throw new PermissionCheckInvalidPlatformError(
        'Method mapWriteStoragePermissionForIos must only be called for iOS',
      )
    }

    // TODO: Maybe this case does not have a corresponding native permission
    // on iOS. The permission would not be granted and not requestable.
    return IOS.MEDIA_LIBRARY
  }
}
