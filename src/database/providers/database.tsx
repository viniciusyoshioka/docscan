import { ReactNode, useEffect } from "react"

import { log } from "@services/log"
import { DocumentRealmProvider, LogRealmProvider, useLogRealm } from "../configs"


function DatabaseConsumer(props: { children?: ReactNode }) {

    const logRealm = useLogRealm()

    useEffect(() => {
        log.setRealm(logRealm)
    }, [])

    return <>{props.children}</>
}


export interface RealmProviderProps {
    children?: ReactNode;
}


export function RealmProvider(props: RealmProviderProps) {
    return (
        <LogRealmProvider>
            <DocumentRealmProvider>
                <DatabaseConsumer>
                    {props.children}
                </DatabaseConsumer>
            </DocumentRealmProvider>
        </LogRealmProvider>
    )
}
