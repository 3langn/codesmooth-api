import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth } from "../../decorators";
import { CreatePaymentUrlInput } from "./dto/payment.dto";

@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Auth()
  @Post("/create-payment-url")
  async createPaymentUrl(@Body() body: CreatePaymentUrlInput, @Req() req: any) {
    const r = await this.paymentService.createPaymentUrl(body, req);
    return new ResponseDefault("Tạo url thanh toán thành công", r);
  }

  @Get("/vnpay_ipn")
  async vnpayIpn(@Req() req: any) {
    return await this.paymentService.vnpayIpn(req);
  }
}
