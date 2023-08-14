import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { CourseEntity } from "../entities/course.entity";
export class CourseRefactoring1689438627322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const x = await queryRunner.manager.find(TransactionEntity);

    const y = x.map(async (tran) => {
      const course = await queryRunner.manager.findOne(CourseEntity, {
        where: { id: tran.course_id },
      });

      if (!course) {
        await queryRunner.manager.delete(TransactionEntity, { id: tran.id });
        return;
      }

      tran.instructor_id = course.owner_id;

      await queryRunner.manager.save(tran);
    });

    await Promise.all(y);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const x = await queryRunner.manager.find(TransactionEntity);

    const y = x.map(async (tran) => {
      tran.instructor_id = null;

      await queryRunner.manager.save(tran);
    });

    await Promise.all(y);
  }
}
