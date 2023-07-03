import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { LessonComponentType } from "../common/enum/lesson-component-type";
import { SectionEntity } from "./section";

export interface ContentCode {
  code: string | undefined;
  judgeContent: {
    testCode: string | undefined;
    executeCode: string | undefined;
  };
  language: string;
  runable: boolean;
  timeLimit: number;
  allowDownload: false;
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
  section_id: number;

  @ManyToOne(() => SectionEntity, (section) => section.lessons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  sections: SectionEntity;
}
