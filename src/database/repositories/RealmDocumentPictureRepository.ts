import { Realm, SortDescriptor } from "realm"

import { DocumentPicture } from "../entities"
import { IRealmDatabaseProvider } from "../providers"
import { DocumentPictureRealmSchema } from "../schemas"
import { IdOf, QueryOptions, WithId } from "../types"
import { stringifyError } from "../utils"
import { DocumentPictureNotFoundError, UnknownDatabaseError } from "./errors"
import { IDocumentPictureRepository } from "./interfaces"


export class RealmDocumentPictureRepository implements IDocumentPictureRepository {


  private realm: Realm


  constructor(realmDatabaseProvider: IRealmDatabaseProvider) {
    this.realm = realmDatabaseProvider.getDatabase()
  }


  public select(id: IdOf<DocumentPicture>): WithId<DocumentPicture> {
    try {
      const object = this.getRealmObject(id)
      return this.toJson(object)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public selectAllForDocument(
    documentId: IdOf<Document>,
    options?: QueryOptions<DocumentPicture>
  ): WithId<DocumentPicture>[] {

    try {
      const realmId = Realm.BSON.ObjectId.createFromHexString(documentId)
      let objects = this.realm
        .objects(DocumentPictureRealmSchema)
        .filtered("belongsTo == $0", realmId)

      if (options?.orderBy) {
        const sorted = this.createSorted(options.orderBy)
        objects = objects.sorted(sorted)
      }

      return objects.map(item => this.toJson(item))
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public insert(picture: DocumentPicture): WithId<DocumentPicture> {
    try {
      const newPicture = this.realm.write(() => {
        const belongsTo = Realm.BSON.ObjectId.createFromHexString(picture.belongsTo)
        return this.realm.create(DocumentPictureRealmSchema, {
          ...picture,
          belongsTo,
        })
      })

      return this.toJson(newPicture)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public update(picture: WithId<DocumentPicture>): WithId<DocumentPicture> {
    try {
      const updatedObject = this.realm.write(() => {
        const object = this.toRealm(picture)
        object.fileName = picture.fileName
        object.position = picture.position
        return object
      })

      return this.toJson(updatedObject)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public delete(id: IdOf<DocumentPicture>): void {
    try {
      const object = this.getRealmObject(id)
      this.realm.delete(object)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }


  private toJson(picture: DocumentPictureRealmSchema): WithId<DocumentPicture> {
    const object = picture.toJSON() as unknown as WithId<DocumentPicture>
    object.id = picture.id.toHexString()
    object.belongsTo = picture.belongsTo.toHexString()
    return object
  }

  private toRealm(picture: WithId<DocumentPicture>): DocumentPictureRealmSchema {
    return this.getRealmObject(picture.id)
  }

  private getRealmObject(id: IdOf<DocumentPicture>): DocumentPictureRealmSchema {
    const realmId = Realm.BSON.ObjectId.createFromHexString(id)
    const object = this.realm.objectForPrimaryKey(DocumentPictureRealmSchema, realmId)
    if (object === null) {
      throw new DocumentPictureNotFoundError(id)
    }
    return object
  }


  private createSorted(
    orderBy: NonNullable<QueryOptions<DocumentPicture>["orderBy"]>
  ): SortDescriptor[] {

    const args: SortDescriptor[] = []
    const orderByEntries = Object.entries(orderBy)
    for (const [key, value] of orderByEntries) {
      args.push([key, value === "desc"])
    }
    return args
  }
}
