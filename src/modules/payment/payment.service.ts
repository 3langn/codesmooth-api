import { Injectable } from "@nestjs/common";
import { sortObject } from "../../common/utils";
import * as moment from "moment";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { TransactionService } from "../admin/transaction/transaction.service";
import { TransactionStatus, TransactionType } from "../../common/enum/transaction";

@Injectable()
export class PaymentService {
  constructor(
    private configService: ApiConfigService,
    private transactionService: TransactionService,
  ) {}
  async createPaymentUrl(body: any, req: any) {
    // const course = await this.courseService.getCourseById(body.course_id);
    const description =
      "Thanh toán cho khóa học " + body.course_name + "- mã khóa học " + body.course_id;

    const transaction = await this.transactionService.createTransaction({
      user_id: req.user.id,
      amount: body.amount,
      type: TransactionType.CUSTOMER_PAY,
      description: description,
      course_id: body.course_id,
      course_name: body.course_name,
    });

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let amount = req.body.amount;

    let vnp_Params = {};
    let vnpUrl = this.configService.VnpayConfig.vnp_VNPayUrl;

    vnp_Params["vnp_Version"] = this.configService.VnpayConfig.vnp_Version;
    vnp_Params["vnp_Command"] = this.configService.VnpayConfig.vnp_Command;
    vnp_Params["vnp_TmnCode"] = this.configService.VnpayConfig.vnp_TmnCode;
    vnp_Params["vnp_Locale"] = this.configService.VnpayConfig.vnp_Locale;
    vnp_Params["vnp_CurrCode"] = this.configService.VnpayConfig.vnp_CurrCode;
    vnp_Params["vnp_TxnRef"] = transaction.id;
    vnp_Params["vnp_OrderInfo"] = description;
    vnp_Params["vnp_OrderType"] = "190000"; // Mã đào tạo
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = this.configService.VnpayConfig.vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    // if (bankCode !== null && bankCode !== "") {
    //   vnp_Params["vnp_BankCode"] = bankCode;
    // }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", this.configService.VnpayConfig.vnp_HashSecret);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
  }

  async vnpayIpn(req: any) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let transactionId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    let vnpAmount = vnp_Params["vnp_Amount"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = this.configService.VnpayConfig.vnp_HashSecret;

    let querystring = require("qs");

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      const transaction = await this.transactionService.getTransactionById(transactionId);

      if (transaction) {
        if (vnpAmount / 100 === transaction.amount) {
          if (transaction.status === TransactionStatus.PENDING) {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == "00") {
              await this.transactionService.transactionSuccess(transactionId);
              return { RspCode: "00", Message: "Success" };
            } else {
              await this.transactionService.transactionFail(transactionId);
              return { RspCode: "00", Message: "Success" };
            }
          } else {
            return {
              RspCode: "02",
              Message: "This order has been updated to the payment status",
            };
          }
        } else {
          return { RspCode: "04", Message: "Amount invalid" };
        }
      } else {
        return { RspCode: "01", Message: "Transaction not found" };
      }
    } else {
      return { RspCode: "97", Message: "Checksum failed" };
    }
  }
}
