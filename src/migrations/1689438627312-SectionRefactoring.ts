import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class SectionRefactoring1689438627312 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "UQ_LESSON_ORDER"`);
    await queryRunner.query(`ALTER TABLE "sections" DROP CONSTRAINT "UQ_SECTION_ORDER"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
