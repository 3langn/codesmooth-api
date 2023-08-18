import { EntityManager } from "typeorm";
import { InstructorBalanceEntity } from "../../entities/instructor_balance.entity";
import { BalanceEntity } from "../../entities/balance.entity";
import { InstructorBalanceHistoryEntity } from "../../entities/instructor_balance_history.entity";
import { TransactionEntity } from "../../entities/transaction.entity";

export class BalanceService {
  constructor() {}

  async transactionSuccess(
    manager: EntityManager,
    instructor_id: number,
    transaction: TransactionEntity,
    buyer_id: number,
  ) {
    const inc = this.increaseBalance(manager, instructor_id, transaction);

    await this.createBalanceHistory(manager, instructor_id, transaction, buyer_id, inc);
  }

  private async createBalanceHistory(
    manager: EntityManager,
    instructor_id: number,
    transaction: TransactionEntity,
    buyer_id: number,
    inc: Promise<void>,
  ) {
    const ib = manager.getRepository(InstructorBalanceEntity).findOne({
      where: {
        instructor_id,
      },
    });

    const ab = manager.getRepository(BalanceEntity).findOne({
      where: {},
    });

    const [ibalance, abalance] = await Promise.all([ib, ab]);
    const ibhReposity = manager.getRepository(InstructorBalanceHistoryEntity);

    const sib = ibhReposity.save(
      ibhReposity.create({
        instructor_id,
        amount: transaction.instructor_income,
        balance_id: ibalance.id,
        course_id: transaction.course_id,
        current_balance: ibalance.current_balance + transaction.instructor_income,
        previous_balance: ibalance.current_balance,
        transaction_id: transaction.id,
        type: transaction.type,
        user_id: buyer_id,
      }),
    );

    await Promise.all([inc, sib]);
  }

  private async increaseBalance(
    manager: EntityManager,
    instructor_id: number,
    transaction: TransactionEntity,
  ) {
    await manager.getRepository(InstructorBalanceEntity).increment(
      {
        instructor_id,
      },
      "current_balance",
      transaction.instructor_income,
    );

    await manager.getRepository(BalanceEntity).increment({}, "current_balance", transaction.income);
  }
}
