import { Realm } from "@realm/react"


export interface DocumentPictureRealm {
    id: Realm.BSON.ObjectId;
    filePath: string;
    position: number;
    belongsToDocument: Realm.BSON.ObjectId;
}


export interface DocumentPicture {
    id: string;
    filePath: string;
    position: number;
    belongsToDocument: string;
}
