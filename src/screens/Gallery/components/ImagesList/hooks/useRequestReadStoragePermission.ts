import { useCallback } from 'react'

import { useLogger } from '@modules/logger'
import type {
  BasePermissionError,
  UsePermissionResult,
  UsePermissionStatus,
} from '@modules/permission'
import {
  MediaType,
  Permissions,
  usePermission,
} from '@modules/permission'
import { getErrorStackTrace } from '@utils'


interface RequestReadStoragePermissionParams {
  onPermissionDenied?: () => void
}


export function useRequestReadStoragePermission(
  params?: RequestReadStoragePermissionParams,
): UsePermissionResult['checkAndRequestIfDenied'] {
  const { onPermissionDenied } = params ?? {}


  const logger = useLogger()


  const onReadStoragePermissionError = useCallback(
    async (error: BasePermissionError) => {
      const errorMessage = `Error requesting ${Permissions.READ_STORAGE} permission: "${error.message}"`
      const errorStack = getErrorStackTrace(error)
      await logger.error(errorMessage, errorStack)
    },
    [logger],
  )

  const onReadStoragePermissionDenied = useCallback(
    async (status: UsePermissionStatus) => {
      await logger.debug(`${Permissions.READ_STORAGE} permission denied (${status})`)
      onPermissionDenied?.()
    },
    [logger, onPermissionDenied],
  )


  const readStoragePermission = usePermission(
    Permissions.READ_STORAGE,
    {
      mediaType: MediaType.IMAGE,
      onError: onReadStoragePermissionError,
      onPermissionDenied: onReadStoragePermissionDenied,
    },
  )


  return readStoragePermission.checkAndRequestIfDenied
}
