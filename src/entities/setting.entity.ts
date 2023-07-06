import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

type SettingThumbnail = string[];

type SettingTargetAudience = string[];

type SettingLicense = string;

type SettingDiscount = number;

type SettingValue = SettingThumbnail | SettingTargetAudience | SettingLicense | SettingDiscount;

@Entity({ name: "settings" })
export class SettingEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  key: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: false, type: "jsonb" })
  value: any | SettingValue;
}
