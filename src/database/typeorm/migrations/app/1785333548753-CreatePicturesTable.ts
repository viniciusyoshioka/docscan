import type { MigrationInterface, QueryRunner } from 'typeorm'


export class CreatePicturesTable1785333548753 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE pictures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        position INTEGER NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents(id)
      );
    `)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE pictures;
    `)
  }
}
