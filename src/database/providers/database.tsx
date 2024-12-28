import { ReactNode } from "react"

import { DocumentRealmProvider, LogRealmProvider } from "../configs"


export interface RealmProviderProps {
  children?: ReactNode
}


export function RealmProvider(props: RealmProviderProps) {
  return (
    <LogRealmProvider>
      <DocumentRealmProvider>
        {props.children}
      </DocumentRealmProvider>
    </LogRealmProvider>
  )
}
