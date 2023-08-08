import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, Unique } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { LessonComponentType } from "../common/enum/lesson-component-type";
import { SectionEntity } from "./section.entity";
import { IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";

export class ContentCode {
  code: string;
  judgeContent: {
    testCode?: string;
    executeCode?: string;
    answerCode?: string;
    sampleCode?: string;
    baseOn?: string; // console or results
  };
  language: string;
  runable: boolean;
  isExercise: boolean;
  isReadOnly: boolean;
  timeLimit: number;
  allowDownload: false;
}
export class LessonComponent {
  @IsNotEmpty({ message: "Content must be not empty" })
  content: ContentCode | any;
  @IsEnum(LessonComponentType, { message: "Type must be a valid type" })
  type: LessonComponentType;
}
@Unique("UQ_LESSON_ORDER", ["order", "section_id"])
@Entity("lessons")
export class LessonEntity extends BaseEntity {
  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: "course_id" })
  course: CourseEntity;

  @Column()
  course_id: number;

  @Column()
  owner_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "owner_id" })
  owner: UserEntity;

  @Column()
  title: string;

  @Column({ default: 0 })
  order: number;

  @Column({ type: "jsonb" })
  components: LessonComponent[];

  @Column({ default: "" })
  summary: string;

  @Column({
    nullable: true,
  })
  section_id: number;

  @ManyToOne(() => SectionEntity, (section) => section.lessons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section: SectionEntity;

  @Column({ nullable: true })
  parent_id: number;

  @ManyToMany(() => UserEntity, (user) => user.completedLessons)
  @JoinTable({
    name: "userscompleted_lessons",
    joinColumn: { name: "lesson_id" },
    inverseJoinColumn: { name: "user_id" },
  })
  completedUsers: UserEntity[];
}
