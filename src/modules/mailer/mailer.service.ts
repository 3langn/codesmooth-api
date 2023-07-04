import { Injectable, Logger } from "@nestjs/common";
import { MailerService as NestMailer } from "@nestjs-modules/mailer";
import { EmailMessageDto } from "./dtos/email.dto";

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(private readonly nestMailerService: NestMailer) {}

  public async sendMail(data: EmailMessageDto) {
    try {
      await this.nestMailerService.sendMail({
        to: data.data.to,
        from: "example@gmail.com",
        subject: data.data.subject,
        template: data.template_id,
        context: data.data.content,
      });
    } catch (error) {
      this.logger.error(`[EMAIL FAILED] ${data.data.to} - ${data.data.subject}`, error.stack);
      throw error;
    }
    this.logger.log(`[EMAIL] ${data.data.to} - ${data.data.subject}`);
  }
}
