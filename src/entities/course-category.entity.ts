import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { CourseCategoryType } from "../common/enum/course-category-type";
import { CourseEntity } from "./course.entity";
import { LessonEntity } from "./lesson.entity";

@Entity("course_categories")
export class CourseCategoryEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "enum", enum: CourseCategoryType })
  type: CourseCategoryType;

  @Column({ default: 0 })
  order: number;

  @Column()
  courseId: number;

  @ManyToOne(() => CourseEntity, (course) => course.category)
  @JoinColumn({ name: "courseId" })
  course: CourseEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.course_category, {
    cascade: true,
  })
  lessons: LessonEntity[];
}
