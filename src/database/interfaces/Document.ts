import { Realm } from "@realm/react"


export interface DocumentRealm {
    id: Realm.BSON.ObjectId;
    createdAt: number;
    modifiedAt: number;
    name: string;
}


export interface Document {
    id: string;
    createdAt: number;
    modifiedAt: number;
    name: string;
}


export interface DocumentInMemory {
    id?: string;
    createdAt: number;
    modifiedAt: number;
    name: string;
}
