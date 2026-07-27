
export enum Permissions {
  CAMERA = 'CAMERA',
  MICROPHONE = 'MICROPHONE',
  NOTIFICATION = 'NOTIFICATION',
  READ_STORAGE = 'READ_STORAGE',
  WRITE_STORAGE = 'WRITE_STORAGE',
}


export enum MediaType {
  ALL = 'ALL',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}


export type PermissionToPermissionOptionsMap = {
  [Permissions.READ_STORAGE]: {
    mediaType: MediaType
  }
}

export type PermissionsWithOptions = keyof PermissionToPermissionOptionsMap
export type PermissionsWithoutOptions = Exclude<
  Permissions,
  PermissionsWithOptions
>

export type PermissionOptions<P extends Permissions> =
  P extends PermissionsWithOptions
    ? PermissionToPermissionOptionsMap[P]
    : never


export interface PermissionResponse {
  isGranted: boolean
  canRequest: boolean
}
