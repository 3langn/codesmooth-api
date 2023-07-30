import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
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

  @ManyToMany(() => CourseEntity, (course) => course.categories)
  courses: CourseEntity[];

  @ManyToMany(() => CategoryEntity, { cascade: true })
  @JoinTable({
    name: "category_parent",
    joinColumn: {
      name: "child_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "parent_id",
      referencedColumnName: "id",
    },
  })
  parent_categories: CategoryEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.parent_categories)
  child_categories: CategoryEntity[];
}
