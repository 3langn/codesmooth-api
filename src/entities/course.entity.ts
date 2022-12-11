import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { CourseCategoryEntity } from "./course-category.entity";

@Entity("courses")
export class CourseEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @OneToMany(() => CourseCategoryEntity, category => category.course)
  category: CourseCategoryEntity;

  @Column({ default: false })
  isPublished: boolean;
}
