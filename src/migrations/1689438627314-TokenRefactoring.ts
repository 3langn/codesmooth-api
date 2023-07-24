import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class TokenRefactoring1689438627314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create table tokens
    await queryRunner.query(
      `CREATE TABLE "tokens" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "token" character varying NOT NULL, "type" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP DEFAULT NULL, CONSTRAINT "PK_8e0b1b0c8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );

    // create unique in user_id and type
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5b1d6d5a1e9d2e8c5f8f1c4c0c" ON "tokens" ("user_id", "type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop table tokens
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
