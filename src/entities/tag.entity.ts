import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { PostEntity } from "./post.entity";

@Entity("tags")
export class TagEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  meta_title: string;

  @Column({ nullable: true })
  content: string;

  @ManyToMany(() => PostEntity, (post) => post.tags, {
    onDelete: "CASCADE",
  })
  posts: PostEntity[];
}
