import { Injectable, Logger } from "@nestjs/common";
import { MailerService as NestMailer } from "@nestjs-modules/mailer";
import {
  ContactContent,
  Content,
  EmailMessageDto,
  PaymentSuccessContent,
  ResetPasswordContent,
} from "./dtos/email.dto";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { TemplateId } from "./enum/template-id";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  constructor(
    private readonly nestMailerService: NestMailer,
    private readonly configService: ApiConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async sendMailVerify(to: string, username: string, user_id: number) {
    try {
      await this.nestMailerService.sendMail({
        to,
        from: "CodeDrafts" + "<" + this.configService.mailerNoreplyConfig.transport.auth.user + ">",
        template: TemplateId.EMAIL_VERIFICATION,
        context: {
          token:
            this.configService.frontendUrl +
            "/verify-email?token=" +
            this.jwtService.generateVerifyEmailToken(user_id),
          username,
        },
        subject: "Xác minh email đăng ký tài khoản",
      });
    } catch (error) {
      this.logger.error(`[EMAIL FAILED] ${to} - ${error}`);
    }
    this.logger.log(`[EMAIL] ${to} - ${username}`);
  }

  async sendMailResetPassword(username: string, to: string, user_id: number) {
    return this.nestMailerService
      .sendMail({
        template: TemplateId.RESET_PASSWORD,
        context: {
          token:
            this.configService.frontendUrl +
            "/reset-password?token=" +
            this.jwtService.generateResetPasswordToken(user_id),
          username: username,
        },
        subject: "Cài đặt lại mật khẩu",
        to: to,
        from: "CodeDrafts" + "<" + this.configService.mailerNoreplyConfig.transport.auth.user + ">",
      })
      .then(() => {
        this.logger.log("Send email reset password successfully");
      })
      .catch((error) => {
        this.logger.error(`[EMAIL FAILED] ${to} - ${error}`);
      });
  }

  async sendMailContact(content: ContactContent, subject: string) {
    try {
      await this.nestMailerService.sendMail({
        to: "contact@codedrafts.com",
        from: "CodeDrafts" + "<" + this.configService.mailerNoreplyConfig.transport.auth.user + ">",
        template: TemplateId.CONTACT,
        context: content,
        subject,
      });
    } catch (error) {
      this.logger.error(`[EMAIL FAILED] ${content.email} - ${error}`);
    }
    this.logger.log(`[EMAIL] ${content.email} - ${content.name}`);
  }

  async sendMailNotiPaymentSuccess(content: PaymentSuccessContent, to: string) {
    content.amount = content.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    try {
      await this.nestMailerService.sendMail({
        to,
        from: "CodeDrafts" + "<" + this.configService.mailerNoreplyConfig.transport.auth.user + ">",
        template: TemplateId.PAYMENT_SUCCESS,
        context: content,
        subject: "Thông báo thanh toán thành công",
      });
    } catch (error) {
      this.logger.error(`[EMAIL PAYMENT FAILED] ${to} - ${error}`);
    }
    this.logger.log(`[EMAIL PAYMENT] ${to} - ${content.username}`);
  }
}
