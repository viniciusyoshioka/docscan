import { MigrationInterface, QueryRunner } from "typeorm"


export class CreateLogTable1739999468414 implements MigrationInterface {

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        code INT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `)
  }


  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS logs;
    `)
  }
}
