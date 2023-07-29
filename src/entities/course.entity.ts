import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { SectionEntity } from "./section.entity";
import { CourseStatus } from "../common/enum/course";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";
import { LessonEntity } from "./lesson.entity";
class RejectedReason {
  reason: string;

  rejected_at: Date;

  rejected_by: string;
}

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

  @Column({ default: 0 })
  base_price: number;

  @Column({ nullable: true })
  published_at: Date;

  // @Column({ type: "text", array: true, default: [] })
  // will_learns: string[];

  // @Column({ type: "text", array: true, default: [] })
  // skills: string[];

  @Column({ default: "" })
  target_audience: string;

  // @Column({ type: "text", array: true, default: [] })
  // tags: string[];

  @Column({ type: "text", array: true, default: [] })
  requirements: string[];

  @Column({ type: "text", array: true, default: [] })
  objectives: string[];

  @Column({ default: "" })
  thumbnail: string;

  // @OneToMany(() => CourseCategoryEntity, (category) => category.course)
  // category: CourseCategoryEntity;

  @Column({ default: CourseStatus.Draft, enum: CourseStatus })
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
  categories: CategoryEntity[];

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

  @Column({ nullable: true })
  feedback_email: string;

  @Column({ default: 0 })
  total_enrollment: number;

  @Column({ nullable: true })
  published_course_id: number;

  @Column({ nullable: true })
  draft_course_id: number;

  @OneToMany(() => SectionEntity, (section) => section.course, {
    cascade: true,
  })
  sections: SectionEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.course, {
    cascade: true,
  })
  lessons: LessonEntity[];

  @Column({ nullable: true, type: "jsonb" })
  rejected_reason: RejectedReason;
}
