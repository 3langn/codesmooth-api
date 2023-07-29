import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class CourseRefactoring1689438627318 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" ADD COLUMN "rejected_reason" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "rejected_reason"`);
  }
}
