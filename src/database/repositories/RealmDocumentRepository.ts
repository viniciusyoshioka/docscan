import { Realm } from "@realm/react"
import { SortDescriptor } from "realm"

import { stringifyError } from "@utils"
import { Document } from "../entities"
import { DocumentNotFoundError, UnknownDatabaseError } from "../errors"
import { IRealmDatabaseProvider } from "../providers"
import { DocumentRealmSchema } from "../schemas"
import { IdOf, QueryOptions, WithId } from "../types"
import { DocumentRepository } from "./interfaces"


// TODO implement pagination for selectAll
export class RealmDocumentRepository implements DocumentRepository {


  private realm: Realm


  constructor(realmDatabaseProvider: IRealmDatabaseProvider) {
    this.realm = realmDatabaseProvider.getDatabase()
  }


  public select(id: IdOf<Document>): WithId<Document> {
    try {
      const object = this.getRealmObject(id)
      return this.toJson(object)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public selectAll(options?: QueryOptions<Document>): WithId<Document>[] {
    try {
      let objects = this.realm.objects(DocumentRealmSchema)

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

  public insert(document: Document): WithId<Document> {
    try {
      const newDocument = this.realm.write(() => {
        return this.realm.create(DocumentRealmSchema, document)
      })

      return this.toJson(newDocument)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public update(document: WithId<Document>): WithId<Document> {
    try {
      const updatedDocument = this.realm.write(() => {
        const object = this.toRealm(document)
        object.createdAt = document.createdAt
        object.modifiedAt = document.modifiedAt
        object.name = document.name
        return object
      })

      return this.toJson(updatedDocument)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }

  public delete(id: IdOf<Document>): void {
    try {
      const object = this.getRealmObject(id)
      this.realm.delete(object)
    } catch (error) {
      const errorMessage = stringifyError(error)
      throw new UnknownDatabaseError(errorMessage)
    }
  }


  private toJson(document: DocumentRealmSchema): WithId<Document> {
    const object = document.toJSON() as unknown as WithId<Document>
    object.id = document.id.toHexString()
    return object
  }

  private toRealm(document: WithId<Document>): DocumentRealmSchema {
    return this.getRealmObject(document.id)
  }

  private getRealmObject(id: IdOf<Document>): DocumentRealmSchema {
    const realmId = Realm.BSON.ObjectId.createFromHexString(id)
    const object = this.realm.objectForPrimaryKey(DocumentRealmSchema, realmId)
    if (object === null) {
      throw new DocumentNotFoundError(id)
    }
    return object
  }


  private createSorted(
    orderBy: NonNullable<QueryOptions<Document>["orderBy"]>
  ): SortDescriptor[] {

    const args: SortDescriptor[] = []
    const orderByEntries = Object.entries(orderBy)
    for (const [key, value] of orderByEntries) {
      if (typeof value === "undefined") {
        continue
      }

      args.push([key, value === "desc"])
    }
    return args
  }
}
