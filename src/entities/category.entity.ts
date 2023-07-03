import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { CourseEntity } from "./course.entity";

@Entity("categories")
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ default: "" })
  description: string;

  @Column({ default: "" })
  thumbnail: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: 0, unique: true })
  order: number;

  @ManyToMany(() => CourseEntity, (course) => course.cat)
  courses: CourseEntity[];
}
