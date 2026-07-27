import type { Permission } from 'react-native-permissions'

import type {
  PermissionOptions,
  Permissions,
} from '../permission-manager.types.ts'


// TODO: Move type to a global app type
export type SupportedPlatformTypes = 'android' | 'ios'


export type NativePermission = Permission


export type PlatformToNativePermissionMap = {
  [K in SupportedPlatformTypes]: NativePermission
}


export type PermissionToMapNativePermissionMethodMap = {
  [P in Permissions]: (params: PermissionOptions<P>) => NativePermission | null
}
