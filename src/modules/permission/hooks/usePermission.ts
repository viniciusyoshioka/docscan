import { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking } from 'react-native'

import type { ResultArray } from '@types'
import type { BasePermissionError } from '../errors'
import { PermissionManager } from '../permission-manager.ts'
import type {
  PermissionOptions,
  PermissionsWithOptions,
  PermissionsWithoutOptions,
} from '../permission-manager.types.ts'
import { Permissions } from '../permission-manager.types.ts'


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


export type OnPermissionError = (error: BasePermissionError) => void

export type OnPermissionDenied = (
  status:
    | UsePermissionStatus.DENIED_CAN_REQUEST
    | UsePermissionStatus.DENIED_CANNOT_REQUEST,
) => void

type CommonPermissionOptions = {
  autoCheck?: boolean
  autoCheckAndRequestIfDenied?: boolean
  onError?: OnPermissionError
  onPermissionDenied?: OnPermissionDenied
}

export type UsePermissionOptions<P extends Permissions> =
  P extends PermissionsWithOptions
    ? PermissionOptions<P> & CommonPermissionOptions
    : CommonPermissionOptions


export interface UsePermissionResult {
  status: UsePermissionStatus
  error: BasePermissionError | null
  openSettings: () => void
  check: () => Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  >
  request: () => Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  >
  checkAndRequestIfDenied: () => Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  >
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
    onError,
    onPermissionDenied,
  } = options ?? {}


  const [status, setStatus] = useState(UsePermissionStatus.UNKNOWN)
  const [error, setError] = useState<BasePermissionError | null>(null)


  const permissionOptions = useMemo((): PermissionOptions<P> => {
    if (permission === Permissions.READ_STORAGE) {
      const opts = options as UsePermissionOptions<Permissions.READ_STORAGE>
      return {
        mediaType: opts.mediaType,
      } as PermissionOptions<P>
    }

    return undefined as never
  }, [permission, options])


  const check = useCallback(async (): Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  > => {
    const skipCheck = SKIP_PERMISSION_CHECK_STATUSES.includes(status)
    if (skipCheck) return [status, null]

    setStatus(UsePermissionStatus.IS_CHECKING)
    setError(null)

    const [newResponse, error] = await PermissionManager.hasPermission(
      permission,
      permissionOptions,
    )

    if (error) {
      setStatus(UsePermissionStatus.ERROR_CHECKING)
      setError(error)
      onError?.(error)
      return [null, error]
    }

    if (newResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return [UsePermissionStatus.GRANTED, null]
    }

    if (newResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      onPermissionDenied?.(UsePermissionStatus.DENIED_CAN_REQUEST)
      return [UsePermissionStatus.DENIED_CAN_REQUEST, null]
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    onPermissionDenied?.(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    return [UsePermissionStatus.DENIED_CANNOT_REQUEST, null]
  }, [
    status,
    permission,
    permissionOptions,
    onError,
    onPermissionDenied,
  ])

  const request = useCallback(async (): Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  > => {
    const skipRequest = SKIP_PERMISSION_REQUEST_STATUSES.includes(status)
    if (skipRequest) return [status, null]

    setStatus(UsePermissionStatus.IS_REQUESTING)
    setError(null)

    const [newResponse, error] = await PermissionManager.requestPermission(
      permission,
      permissionOptions,
    )

    if (error) {
      setStatus(UsePermissionStatus.ERROR_REQUESTING)
      setError(error)
      onError?.(error)
      return [null, error]
    }

    if (newResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return [UsePermissionStatus.GRANTED, null]
    }

    if (newResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      onPermissionDenied?.(UsePermissionStatus.DENIED_CAN_REQUEST)
      return [UsePermissionStatus.DENIED_CAN_REQUEST, null]
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    onPermissionDenied?.(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    return [UsePermissionStatus.DENIED_CANNOT_REQUEST, null]
  }, [
    status,
    permission,
    permissionOptions,
    onError,
    onPermissionDenied,
  ])

  const openSettings = useCallback((): void => {
    Linking.openSettings()
  }, [])

  const checkAndRequestIfDenied = useCallback(async (): Promise<
    ResultArray<UsePermissionStatus, BasePermissionError>
  > => {
    const skipCheck = SKIP_PERMISSION_CHECK_STATUSES.includes(status)
    if (skipCheck) return [status, null]

    const skipRequest = SKIP_PERMISSION_REQUEST_STATUSES.includes(status)
    if (skipRequest) return [status, null]

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
      onError?.(checkError)
      return [null, checkError]
    }

    if (checkResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return [UsePermissionStatus.GRANTED, null]
    }

    if (!checkResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
      onPermissionDenied?.(UsePermissionStatus.DENIED_CANNOT_REQUEST)
      return [UsePermissionStatus.DENIED_CANNOT_REQUEST, null]
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
      onError?.(requestError)
      return [null, requestError]
    }

    if (requestResponse.isGranted) {
      setStatus(UsePermissionStatus.GRANTED)
      return [UsePermissionStatus.GRANTED, null]
    }

    if (requestResponse.canRequest) {
      setStatus(UsePermissionStatus.DENIED_CAN_REQUEST)
      onPermissionDenied?.(UsePermissionStatus.DENIED_CAN_REQUEST)
      return [UsePermissionStatus.DENIED_CAN_REQUEST, null]
    }

    setStatus(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    onPermissionDenied?.(UsePermissionStatus.DENIED_CANNOT_REQUEST)
    return [UsePermissionStatus.DENIED_CANNOT_REQUEST, null]
  }, [
    status,
    permission,
    permissionOptions,
    onError,
    onPermissionDenied,
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
