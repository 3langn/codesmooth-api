import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { CourseEntity } from "../entities/course.entity";
export class CourseRefactoring1689438627323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const x = await queryRunner.manager.find(TransactionEntity);

    const y = x.map(async (tran) => {
      await queryRunner.manager
        .update(
          TransactionEntity,
          { id: tran.id },
          // đổi amount thành số chẵn hàng nghìn. Ví dụ: 123456 -> 123000
          { amount: Math.floor(tran.amount / 1000) * 1000 },
        )
        .then(async () => {
          const income = Math.floor(tran.amount * 30) / 100;
          await queryRunner.manager.update(
            TransactionEntity,
            { id: tran.id },
            {
              instructor_income: tran.amount - income,
              income: income,
            },
          );
        });
    });

    await Promise.all(y);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const x = await queryRunner.manager.find(TransactionEntity);

    const y = x.map(async (tran) => {
      queryRunner.manager.update(
        TransactionEntity,
        { id: tran.id },
        { instructor_income: null, income: null },
      );
    });

    await Promise.all(y);
  }
}
