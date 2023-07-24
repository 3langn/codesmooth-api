import { Body, Controller, Get, Headers, HttpStatus, Post, Req } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth } from "../../decorators";
import { CalculateRequestDto, CreatePaymentUrlInput } from "./dto/payment.dto";
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

  // @Auth()
  @Post("/calculate")
  async calculate(@Body() body: CalculateRequestDto) {
    return await this.paymentService.calculate(body);
  }

  // @Auth()
  @Post("/calculate-number-larger-than-10")
  async calculateNumberLargerThan10(@Body() body: { number: number }) {
    const n = body.number;

    if (n < 10) {
      return {
        message: "number is smaller than 10",
      };
    }

    if (n === 10) {
      return {
        message: "number is equal 10",
      };
    }

    return {
      message: "number is larger than 10",
    };
  }

  @Post("/incorrect-calculate-number-larger-than-10")
  async incorrectCalculateNumberLargerThan10(@Body() body: { number: number }) {
    const n = body.number;

    if (n > 10) {
      return {
        message: "number is smaller than 10",
      };
    }

    if (n === 10) {
      return {
        message: "number is equal 10",
      };
    }

    return {
      message: "number is larger than 10",
    };
  }
}
