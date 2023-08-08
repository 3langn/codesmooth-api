import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
export class LessonRefactoring1689438627322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS userscompleted_lessons (
        lesson_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        CONSTRAINT userscompleted_lessons_pkey PRIMARY KEY (lesson_id, user_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE userscompleted_lessons;`);
  }
}
