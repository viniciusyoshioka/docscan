import { PrimaryGeneratedColumn } from "typeorm"


export class BaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string
}
