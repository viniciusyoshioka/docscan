import { Realm } from "@realm/react"
import { SortDescriptor } from "realm"

import { Document } from "../entities"
import { IRealmDatabaseProvider } from "../providers"
import { DocumentRealmSchema } from "../schemas"
import { QueryOptions, WithId } from "../types"
import { stringifyError } from "../utils"
import { DocumentNotFoundError, UnknownDatabaseError } from "./errors"
import { IDocumentRepository } from "./interfaces"


export class RealmDocumentRepository implements IDocumentRepository {


  private realm: Realm


  constructor(realmDatabaseProvider: IRealmDatabaseProvider) {
    this.realm = realmDatabaseProvider.getDatabase()
  }


  public select(id: WithId<Document>["id"]): WithId<Document> {
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

  public delete(id: WithId<Document>["id"]): void {
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

  private getRealmObject(id: WithId<Document>["id"]): DocumentRealmSchema {
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
    const orderByKeys = Object.entries(orderBy)
    for (const [key, value] of orderByKeys) {
      args.push([key, value === "desc"])
    }
    return args
  }
}