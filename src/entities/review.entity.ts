import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
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

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: "review_like_users",
    joinColumn: {
      name: "review_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  like_users: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: "review_dislike_users",
    joinColumn: {
      name: "review_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  dislike_users: UserEntity[];

  like_count: number;
  dislike_count: number;

  is_like_count: number;
  is_dislike_count: number;
}
