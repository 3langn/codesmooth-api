import { Module } from "@nestjs/common";
import { OtherService } from "./other.service";
import { OtherControler } from "./other.controller";
import { MailerModule } from "../mailer/mailer.module";

@Module({
  imports: [MailerModule],
  providers: [OtherService],
  controllers: [OtherControler],
})
export class OtherModule {}
