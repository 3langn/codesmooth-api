import { IsNotEmpty } from "class-validator";

export class AttachmentData {
  @IsNotEmpty({ message: "file_name is required" })
  file_name: string;

  @IsNotEmpty({ message: "attachments.data is required" })
  data: any;
}

// export class VerifyEmailMesage extends WorkerMessage {
//   data: VerifyEmailData;
// }

// Content là những field sẽ được render trong template

export type Content = VerifyEmailContent | ResetPasswordContent | ContactContent;
export class VerifyEmailContent {
  token: string;
  username: string;
}

export class ResetPasswordContent {
  token: string;
  username: string;
}

export class ContactContent {
  name: string;

  email: string;

  message: string;

  phone: string;
}

export interface PaymentContent {
  username: string;
  transId: string;
  time: string;
  courseId: number;
  courseName: string;
  amount: number | string;
  paymentMethod: string;
}
export class EmailDataDto<T = Content> {
  from: string;

  to: string;

  subject: string;

  content: T;
}

export class EmailMessageDto<T = Content> {
  data: EmailDataDto<T>;

  template_id: string;
}
