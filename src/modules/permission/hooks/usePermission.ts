import { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking } from 'react-native'

import type { BasePermissionError } from '../errors'
import { PermissionManager } from '../permission-manager.ts'
import type {
  PermissionOptions,
  PermissionsWithOptions,
  PermissionsWithoutOptions,
} from '../permission-manager.types.ts'
import { Permissions } from '../permission-manager.types.ts'


type CommonPermissionOptions = {
  autoCheck?: boolean
  autoCheckAndRequestIfDenied?: boolean
}

export type UsePermissionOptions<P extends Permissions> =
  P extends PermissionsWithOptions
    ? PermissionOptions<P> & CommonPermissionOptions
    : CommonPermissionOptions


export enum UsePermissionStatus {
  UNKNOWN = 'UNKNOWN',
  IS_CHECKING = 'IS_CHECKING',
  ERROR_CHECKING = 'ERROR_CHECKING',
  IS_REQUESTING = 'IS_REQUESTING',
  ERROR_REQUESTING = 'ERROR_REQUESTING',
  GRANTED = 'GRANTED',
  DENIED_CAN_REQUEST = 'DENIED_CAN_REQUEST',
  DENIED_CANNOT_REQUEST = 'DENIED_CANNOT_REQUEST',
}


export interface UsePermissionResult {
  status: UsePermissionStatus
  error: BasePermissionError | null
  check: () => Promise<void>
  request: () => Promise<void>
  openSettings: () => void
  checkAndRequestIfDenied: () => Promise<void>
}


const SKIP_PERMISSION_CHECK_STATUSES = [
  UsePermissionStatus.IS_CHECKING,
  UsePermissionStatus.IS_REQUESTING,
  UsePermissionStatus.DENIED_CANNOT_REQUEST,
]

const SKIP_PERMISSION_REQUEST_STATUSES = [
  UsePermissionStatus.IS_CHECKING,
  UsePermissionStatus.IS_REQUESTING,
  UsePermissionStatus.DENIED_CANNOT_REQUEST,
]


export function usePermission<P extends PermissionsWithOptions>(
  permission: P,
  options: PermissionOptions<P> & CommonPermissionOptions,
): UsePermissionResult
export function usePermission(
  permission: PermissionsWithoutOptions,
  options?: CommonPermissionOptions,
): UsePermissionResult
export function usePermission<P extends Permissions>(
  permission: P,
  options?:
    | PermissionOptions<P> & CommonPermissionOptions
    | CommonPermissionOptions,
): UsePermissionResult {
  const {
    autoCheck = false,
    autoCheckAndRequestIfDenied = false,
  } = options ?? {}


  const [status, setStatus] = useState(UsePermissionStatus.UNKNOWN)
  const [error, setError] = useState<BasePermissionError | null>(null)


  const permissionOptions = useMemo((): PermissionOptions<P> => {
    if (permission === Permissions.READ_STORAGE) {
      const opts = options as UsePermissionOptions<Permissions.READ_STORAGE>
      return <PermissionOptions<Permissions.READ_STORAGE>>{
        mediaType: opts.mediaType,
      } as PermissionOptions<P>
    }

    return undefined as never
  }, [permission, options])


  const check = useCallback(async (): Promise<void> => {
    const skipCheck = SKIP_PERMISSION_CHECK_STATUSES.includes(status)
    if (skipCheck) return

    setStatus(UsePermissionStatus.IS_CHECKING)
    setError(null)

    const [newResponse, error] = await PermissionManager.hasPermission(
      permission,
      permissionOptions,
    )

    if (error) {
      setStatus(UsePermissionStatus.ERROR_CHECKING)
      setError(error)
      return
    }

    if (newResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return
    }

    if (newResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      return
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
  }, [
    status,
    permission,
    permissionOptions,
  ])

  const request = useCallback(async (): Promise<void> => {
    const skipRequest = SKIP_PERMISSION_REQUEST_STATUSES.includes(status)
    if (skipRequest) return

    setStatus(UsePermissionStatus.IS_REQUESTING)
    setError(null)

    const [newResponse, error] = await PermissionManager.requestPermission(
      permission,
      permissionOptions,
    )

    if (error) {
      setStatus(UsePermissionStatus.ERROR_REQUESTING)
      setError(error)
      return
    }

    if (newResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return
    }

    if (newResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      return
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
  }, [
    status,
    permission,
    permissionOptions,
  ])

  const openSettings = useCallback((): void => {
    Linking.openSettings()
  }, [])

  const checkAndRequestIfDenied = useCallback(async (): Promise<void> => {
    const skipCheck = SKIP_PERMISSION_CHECK_STATUSES.includes(status)
    if (skipCheck) return

    const skipRequest = SKIP_PERMISSION_REQUEST_STATUSES.includes(status)
    if (skipRequest) return

    setStatus(UsePermissionStatus.IS_CHECKING)
    setError(null)

    const checkResult = await PermissionManager.hasPermission(
      permission,
      permissionOptions,
    )
    const [checkResponse, checkError] = checkResult

    if (checkError) {
      setStatus(UsePermissionStatus.ERROR_CHECKING)
      setError(checkError)
      return
    }

    if (checkResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return
    }

    if (!checkResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
      return
    }

    setStatus(UsePermissionStatus.IS_REQUESTING)

    const requestResult = await PermissionManager.requestPermission(
      permission,
      permissionOptions,
    )
    const [requestResponse, requestError] = requestResult

    if (requestError) {
      setStatus(UsePermissionStatus.ERROR_REQUESTING)
      setError(requestError)
      return
    }

    if (requestResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return
    }

    if (requestResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      return
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
  }, [
    status,
    permission,
    permissionOptions,
  ])


  const autoCheckOrCheckAndRequestIfDenied = useCallback(async () => {
    if (autoCheck) {
      await check()
      return
    }

    if (autoCheckAndRequestIfDenied) {
      await checkAndRequestIfDenied()
    }
  }, [autoCheck, autoCheckAndRequestIfDenied, check, checkAndRequestIfDenied])


  useEffect(() => {
    autoCheckOrCheckAndRequestIfDenied()
  }, [])


  const usePermissionResult = useMemo<UsePermissionResult>(() => ({
    status,
    error,
    check,
    request,
    openSettings,
    checkAndRequestIfDenied,
  }), [
    status,
    error,
    check,
    request,
    openSettings,
    checkAndRequestIfDenied,
  ])


  return usePermissionResult
}
