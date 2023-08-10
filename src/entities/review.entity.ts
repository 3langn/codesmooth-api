import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { UserEntity } from "./user.entity";
import { CourseEntity } from "./course.entity";

@Entity("reviews")
export class ReviewEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column()
  user_id: number;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: "course_id" })
  course: CourseEntity;

  @Column()
  course_id: number;

  @Column({
    type: "float",
    default: 0,
  })
  rating: number;

  @Column()
  comment: string;
}
