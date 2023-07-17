import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { SectionTypeEnum } from "../common/enum/course-category-type";
import { CourseEntity } from "./course.entity";
import { LessonEntity } from "./lesson.entity";
import { UserEntity } from "./user.entity";

@Unique("UQ_SECTION_ORDER", ["order", "course_id"])
@Entity("sections")
export class SectionEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, {
    cascade: true,
  })
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @Column()
  title: string;

  @Column({ type: "enum", enum: SectionTypeEnum })
  type: SectionTypeEnum;

  @Column({})
  order: number;

  @Column()
  course_id: number;

  @ManyToOne(() => CourseEntity, (course) => course.sections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course: CourseEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.section, {
    cascade: true,
  })
  lessons: LessonEntity[];
}
