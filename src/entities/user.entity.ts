import { Column, Entity, OneToOne, BeforeInsert, OneToMany, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { UserRole } from "../common/enum/user-role";
import { generateHash } from "../common/utils";
import { VirtualColumn } from "../decorators";
import { UserDto } from "../modules/user/dtos/user.dto";
import { UserSettingsEntity } from "./user-settings.entity";
import { CourseEntity } from "./course.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: "active" })
  status: string;

  // TODO: Next use rbac
  @Column({ enum: UserRole, default: UserRole.ADMINSTRATOR })
  role: UserRole;

  @VirtualColumn()
  fullName?: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @BeforeInsert()
  hashPassword() {
    this.password = generateHash(this.password);
  }

  toDto(): UserDto {
    delete this.password;
    return {
      ...this,
      fullName: this.fullName,
    };
  }

  @OneToMany(() => CourseEntity, (course) => course.owner)
  courses: CourseEntity[];

  @ManyToMany(() => CourseEntity, (course) => course.students)
  enrolledCourses: CourseEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];
}
