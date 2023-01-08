import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { CourseCategoryEntity } from "./course-category.entity";

@Entity("courses")
export class CourseEntity extends BaseEntity {
  @Column()
  name: string;

  @Column({ default: "" })
  summary: string;

  @Column({ default: "" })
  course_objectives: string;

  @Column({ type: "text", array: true, default: [] })
  will_learns: string[];

  @Column({ default: "" })
  target_audience: string;

  @Column({ type: "text", array: true, default: [] })
  skills: string[];

  @Column({ type: "text", array: true, default: [] })
  tags: string[];

  @Column({ type: "text", array: true, default: [] })
  requirements: string[];

  @Column({ default: "" })
  thumbnail: string;

  @Column()
  price: number;

  @OneToMany(() => CourseCategoryEntity, (category) => category.course)
  category: CourseCategoryEntity;

  @Column({ default: false })
  is_published: boolean;
}
