import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class CourseRefactoring1689438627319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // add column level to course, modify target_audience to enum, tag to string
    await queryRunner.query(
      `ALTER TABLE "courses" ADD COLUMN "level" character varying(255) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(`ALTER TABLE "courses" ALTER COLUMN "target_audience" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "target_audience" TYPE character varying(255) USING "target_audience"::character varying(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "level"`);
    await queryRunner.query(
      `ALTER TABLE "courses" ALTER COLUMN "target_audience" TYPE character varying(255) USING "target_audience"::character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "courses" ALTER COLUMN "target_audience" SET DEFAULT ''`);
  }
}
