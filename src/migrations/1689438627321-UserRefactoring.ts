import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class CourseRefactoring1689438627321 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add column social = "google" || "facebook" || "github" to table users
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN social VARCHAR(20) DEFAULT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "social"`);
  }
}
