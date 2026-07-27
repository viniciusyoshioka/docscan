import type { PropsWithChildren } from 'react'
import { createContext, useContext } from 'react'

import type { FileSystem } from './file-system.base.ts'


const FileSystemContext = createContext<FileSystem | null>(null)


interface FileSystemProviderProps extends PropsWithChildren {
  fileSystem: FileSystem
}


export function FileSystemProvider(props: FileSystemProviderProps) {
  return (
    <FileSystemContext.Provider value={props.fileSystem}>
      {props.children}
    </FileSystemContext.Provider>
  )
}


export function useFileSystem(): FileSystem {
  const fileSystem = useContext(FileSystemContext)

  if (!fileSystem) {
    throw new Error(
      'No value returned for useFileSystem. Probably FileSystemProvider is missing',
    )
  }

  return fileSystem
}
