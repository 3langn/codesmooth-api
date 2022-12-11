import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { CourseCategoryType } from "../common/enum/course-category-type";
import { CourseEntity } from "./course.entity";
import { LessionEntity } from "./lession.entity";

@Entity("course_categories")
export class CourseCategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "enum", enum: CourseCategoryType })
  type: CourseCategoryType;

  @Column()
  courseId: number;

  @ManyToOne(() => CourseEntity, course => course.category)
  @JoinColumn({ name: "courseId" })
  course: CourseEntity;

  @OneToMany(() => LessionEntity, lession => lession.course_category)
  lessions: LessionEntity[];
}
