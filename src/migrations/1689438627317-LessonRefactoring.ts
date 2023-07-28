import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class LessonRefactoring1689438627317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // owner_id is not null
    await queryRunner.query(`ALTER TABLE "lessons" ALTER COLUMN "owner_id" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // owner_id is null
    await queryRunner.query(`ALTER TABLE "lessons" ALTER COLUMN "owner_id" DROP NOT NULL`);
  }
}
