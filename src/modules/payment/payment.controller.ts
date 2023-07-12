import { Body, Controller, Get, Headers, HttpStatus, Post, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth } from "../../decorators";
import { CreatePaymentUrlInput } from "./dto/payment.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";

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
    console.log(req.headers);

    // if (!req.host.includes("vnpayment.vn")) {
    //   throw new CustomHttpException({
    //     message: "Invalid request",
    //     code: StatusCodesList.InvalidCredentials,
    //     statusCode: HttpStatus.BAD_REQUEST,
    //   });
    // }

    return await this.paymentService.vnpayIpn(req);
  }
}
