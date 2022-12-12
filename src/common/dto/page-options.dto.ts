import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from "../../decorators";
import { OrderType } from "../enum/order";

export class PageOptionsDto {
  readonly sort?: string = "created_at";

  @EnumFieldOptional(() => OrderType, {
    default: OrderType.ASC,
  })
  readonly order: OrderType = OrderType.ASC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @StringFieldOptional()
  readonly q?: string;
}
