import { Realm } from "@realm/react"


export interface DocumentPictureRealm {
    id: Realm.BSON.ObjectId;
    filePath: string;
    position: number;
    belongsToDocument: Realm.BSON.ObjectId;
}
