import { Injectable, Module } from "@nestjs/common";
import { ContactRequest } from "./dto/contact.dto";
import { MailerService } from "../mailer/mailer.service";
import { ContactContent } from "../mailer/dtos/email.dto";

@Injectable()
export class OtherService {
  constructor(private readonly mailerService: MailerService) {}

  async contactUs(data: ContactRequest) {
    this.mailerService.sendMailContact(
      {
        email: data.email,
        name: data.name,
        message: data.message,
        phone: data.phone,
      },
      data.subject,
    );
  }
}
