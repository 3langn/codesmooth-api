import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class UserRefactoring1689438627315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // default role is USER
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
