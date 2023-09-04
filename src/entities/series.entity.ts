import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { PostEntity } from "./post.entity";

@Entity("series")
export class SeriesEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => PostEntity, (p) => p.series)
  posts: PostEntity[];

  @Column({ nullable: true })
  author_id: number;
}
