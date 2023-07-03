import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { SectionTypeEnum } from "../common/enum/course-category-type";
import { CourseEntity } from "./course.entity";
import { LessonEntity } from "./lesson.entity";

@Entity("sections")
export class SectionEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "enum", enum: SectionTypeEnum })
  type: SectionTypeEnum;

  @Column({ default: 0 })
  order: number;

  @Column()
  course_id: number;

  // @ManyToOne(() => CourseEntity, (course) => course.category)
  // @JoinColumn({ name: "courseId" })
  // course: CourseEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.sections, {
    cascade: true,
  })
  lessons: LessonEntity[];
}
