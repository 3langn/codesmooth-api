import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { CourseEntity } from "../entities/course.entity";
import { UserEntity } from "../entities/user.entity";
import { InstructorBalanceEntity } from "../entities/instructor_balance.entity";
import { BalanceEntity } from "../entities/balance.entity";
import { InstructorBalanceHistoryEntity } from "../entities/instructor_balance_history.entity";
import { TransactionStatus } from "../common/enum/transaction";
export class BalanceRefactoring1689438627327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.find(UserEntity);

    const aBalance = queryRunner.manager.create(BalanceEntity, {
      current_balance: 0,
    });

    const transaction = await queryRunner.manager.find(TransactionEntity, {
      order: {
        created_at: "ASC",
      },
    });

    const arr = transaction.map(async (t) => {
      let income = 0;
      if (t.status === TransactionStatus.SUCCESS) {
        income = t.income;
      }
      aBalance.current_balance += income;

      return queryRunner.manager.update(
        TransactionEntity,
        { id: t.id },
        {
          previous_balance: aBalance.current_balance - income,
          current_balance: aBalance.current_balance,
        },
      );
    });

    await Promise.all(arr);
    await queryRunner.manager.save(aBalance);

    const m = user.map(async (u) => {
      const it = queryRunner.manager.create(InstructorBalanceEntity, {
        current_balance: 0,
        instructor_id: u.id,
      });

      const trans = await queryRunner.manager.find(TransactionEntity, {
        where: {
          instructor_id: u.id,
          status: TransactionStatus.SUCCESS,
        },
        order: {
          created_at: "ASC",
        },
      });

      const itbalance = await queryRunner.manager.save(it);

      const arrHistory = trans.map(async (t) => {
        // const income = Math.floor(t.amount * 0.3);
        const instructor_income = Math.floor(t.amount * 0.7);

        const x = queryRunner.manager.create(InstructorBalanceHistoryEntity, {
          amount: instructor_income,
          balance_id: itbalance.id,
          current_balance: itbalance.current_balance + instructor_income,
          previous_balance: itbalance.current_balance,
          transaction_id: t.id,
          instructor_id: u.id,
          created_at: t.created_at,
          updated_at: t.updated_at,
          course_id: t.course_id,
          user_id: t.user_id,
          type: t.type,
        });

        itbalance.current_balance += instructor_income;
        return x;
      });

      await queryRunner.manager.save(InstructorBalanceHistoryEntity, await Promise.all(arrHistory));
      await queryRunner.manager.update(
        InstructorBalanceEntity,
        {
          id: itbalance.id,
        },
        {
          current_balance: itbalance.current_balance,
        },
      );
    });

    await Promise.all(m);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete all balance history
    await queryRunner.manager.delete(InstructorBalanceHistoryEntity, {});
    await queryRunner.manager.delete(BalanceEntity, {});
    await queryRunner.manager.delete(InstructorBalanceEntity, {});
  }
}
