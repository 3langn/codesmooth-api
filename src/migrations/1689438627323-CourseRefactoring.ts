import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { CourseEntity } from "../entities/course.entity";
import { UserEntity } from "../entities/user.entity";
import { InstructorBalanceEntity } from "../entities/instructor_balance.entity";
import { BalanceEntity } from "../entities/balance.entity";
import { BalanceHistoryEntity } from "../entities/balance_history.entity";
import { InstructorBalanceHistoryEntity } from "../entities/instructor_balance_history.entity";
import { TransactionStatus } from "../common/enum/transaction";
export class BalanceRefactoring1689438627327 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const user = await queryRunner.manager.find(UserEntity);

    const aBalance = queryRunner.manager.create(BalanceEntity, {
      current_balance: 0,
    });

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

      // const y = trans.map(async (t) => {
      //   const income = Math.floor(t.amount * 0.3);
      //   const instructor_income = Math.floor(t.amount * 0.7);
      //   t.previouse_balance = aBalance.current_balance;
      //   t.ins_previouse_balance = itbalance.current_balance;
      //   t.income = income;
      //   t.instructor_income = instructor_income;
      //   t.ins_current_balance = itbalance.current_balance + instructor_income;
      //   t.current_balance = aBalance.current_balance + income;

      //   itbalance.current_balance += instructor_income;
      //   aBalance.current_balance += income;

      //   await queryRunner.manager.save(t);
      // });

      // await Promise.all(y);

      const aArrayHistory = [];
      const arrHistory = trans.map(async (t) => {
        const income = Math.floor(t.amount * 0.3);
        const instructor_income = Math.floor(t.amount * 0.7);

        await queryRunner.manager.update(TransactionEntity, t.id, {
          income,
          instructor_income,
        });

        const b = new BalanceHistoryEntity();
        b.amount = income;
        b.balance_id = aBalance.id;
        b.previous_balance = aBalance.current_balance;
        b.current_balance = aBalance.current_balance + income;
        b.transaction_id = t.id;
        b.course_id = t.course_id;
        b.type = t.type;
        b.user_id = t.user_id;
        b.created_at = t.created_at;
        b.updated_at = t.updated_at;

        aArrayHistory.push(b);

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
        aBalance.current_balance += income;

        return x;
      });

      await queryRunner.manager.save(InstructorBalanceHistoryEntity, await Promise.all(arrHistory));
      await queryRunner.manager.save(BalanceHistoryEntity, aArrayHistory);
      await queryRunner.manager.update(
        InstructorBalanceEntity,
        {
          id: itbalance.id,
        },
        {
          current_balance: itbalance.current_balance,
        },
      );
      await queryRunner.manager.save(BalanceEntity, aBalance);
    });

    await Promise.all(m);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // delete all balance history
    await queryRunner.manager.delete(BalanceHistoryEntity, {});
    await queryRunner.manager.delete(InstructorBalanceHistoryEntity, {});
    await queryRunner.manager.delete(BalanceEntity, {});
    await queryRunner.manager.delete(InstructorBalanceEntity, {});
  }
}
