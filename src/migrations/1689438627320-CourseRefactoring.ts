import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class CourseRefactoring1689438627320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // update main_category_id = 562691633
    await queryRunner.query(`
      UPDATE courses
      SET main_category_id = 562691633
      WHERE main_category_id IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_main_category"`);
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "main_category_id"`);
  }
}
