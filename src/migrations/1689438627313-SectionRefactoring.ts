import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class SectionRefactoring1689438627313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // change column name "value" to "values" in the settings table
    await queryRunner.query(`ALTER TABLE "settings" RENAME COLUMN "value" TO "values"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
