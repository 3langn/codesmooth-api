import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { SectionEntity } from "./section";
import { CourseStatus } from "../common/enum/course";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";

@Entity("courses")
export class CourseEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  short_description: string;

  @Column()
  price: number;

  // @Column({ type: "text", array: true, default: [] })
  // will_learns: string[];

  @Column({ type: "text", array: true, default: [] })
  skills: string[];

  @Column({ default: "" })
  target_audience: string;

  // @Column({ type: "text", array: true, default: [] })
  // tags: string[];

  @Column({ type: "text", array: true, default: [] })
  requirements: string[];

  @Column({ default: "" })
  thumbnail: string;

  // @OneToMany(() => CourseCategoryEntity, (category) => category.course)
  // category: CourseCategoryEntity;

  @Column({ default: false, enum: CourseStatus })
  status: CourseStatus;

  @ManyToOne(() => UserEntity, (owner) => owner.courses, {
    nullable: false,
  })
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @Column({ nullable: false })
  owner_id: number;

  @ManyToMany(() => CategoryEntity, (category) => category.courses)
  @JoinTable({
    name: "course_cat",
    joinColumn: {
      name: "course_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  cat: CategoryEntity[];

  @ManyToMany(() => UserEntity, (user) => user.enrolledCourses)
  @JoinTable({
    name: "course_student",
    joinColumn: {
      name: "course_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "student_id",
      referencedColumnName: "id",
    },
  })
  students: UserEntity[];
}
