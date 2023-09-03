import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { UserEntity } from "./user.entity";
import { IsEnum, IsNotEmpty } from "class-validator";
import { TagEntity } from "./tag.entity";

export enum PostComponentType {
  TEXT = "text",
  CODE = "code",
  IMAGE = "image",
}

export class PostComponent {
  @IsNotEmpty({ message: "Content must be not empty" })
  content: string;
  @IsEnum(PostComponentType, { message: "Type must be a valid type" })
  type: PostComponentType;
}

@Entity("posts")
export class PostEntity extends BaseEntity {
  @Column({ default: 1 })
  thumbnail_style: number;

  @Column()
  thumbnail_url: string;

  @Column()
  title: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "author_id" })
  author: UserEntity;

  @Column()
  author_id: number;

  @Column()
  meta_title: string;

  @Column()
  summary: string;

  @Index("slug_index")
  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  published_at: Date;

  @Column({ type: "jsonb" })
  components: PostComponent[];

  @ManyToMany(() => TagEntity, (tag) => tag.posts, {
    onDelete: "CASCADE",
  })
  @JoinTable({
    name: "posts_tags",
    joinColumn: {
      name: "post_id",
    },
    inverseJoinColumn: {
      name: "tag_id",
    },
  })
  tags: TagEntity[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: "#000000" })
  title_color: string;

  @Column({ default: 0 })
  reading_time: number;
}
