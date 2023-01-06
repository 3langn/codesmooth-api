import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { LessonComponentType } from "../common/enum/lesson-component-type";
import { CourseCategoryEntity } from "./course-category.entity";

export interface ContentCode {
  content: {
    code: string | undefined;
    judgeContent: {
      testCode: string | undefined;
      executeCode: string | undefined;
    };
    language: string;
    runable: boolean;
    timeLimit: number;
    allowDownload: false;
  };
  type: string;
}
export class LessonComponent {
  content: ContentCode | any;
  type: LessonComponentType;
}

@Entity("lessons")
export class LessonEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ type: "jsonb" })
  components: LessonComponent[];

  @Column({ default: "" })
  summary: string;

  @Column()
  course_category_id: number;

  @ManyToOne(() => CourseCategoryEntity, (course_category) => course_category.lessons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_category_id" })
  course_category: CourseCategoryEntity;
}
