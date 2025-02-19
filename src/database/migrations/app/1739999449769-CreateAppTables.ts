import { MigrationInterface, QueryRunner } from "typeorm"


export class CreateAppTables1739999449769 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pictures (
        id TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        position INT NOT NULL,
        document_id TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents(id)
      );
    `)
  }


  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS documents;
    `)

    await queryRunner.query(`
      DROP TABLE IF EXISTS pictures;
    `)
  }
}
