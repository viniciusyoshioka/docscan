import { Realm } from "@realm/react"


export interface DocumentRealm {
    id: Realm.BSON.ObjectId
    createdAt: number
    modifiedAt: number
    name: string
}
