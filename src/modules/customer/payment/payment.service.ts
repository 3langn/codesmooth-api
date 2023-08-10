import { HttpStatus, Injectable } from "@nestjs/common";
import * as moment from "moment";
import { CourseService } from "../course/course.service";
import { CalculateRequestDto, CreatePaymentUrlInput } from "./dto/payment.dto";
import axios from "axios";

import { TransactionService } from "../transaction/transaction.service";
import { ApiConfigService } from "../../../shared/services/api-config.service";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { generateTransactionId } from "../../../common/generate-nanoid";
import { TransactionStatus, TransactionType } from "../../../common/enum/transaction";
import { sortObject } from "../../../common/utils";
import { TransactionEntity } from "../../../entities/transaction.entity";

@Injectable()
export class PaymentService {
  constructor(
    private configService: ApiConfigService,
    private transactionService: TransactionService,
    private courseService: CourseService,
  ) {}
  async createPaymentUrl(body: CreatePaymentUrlInput, req: any): Promise<string | null> {
    const course = await this.courseService.getCourseById(body.course_id, req.user.id);

    if (course.is_bought) {
      throw new CustomHttpException({
        code: StatusCodesList.BadRequest,
        message: "Bạn đã mua khóa học này rồi",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const description =
      "Thanh toán cho khóa học " + course.name + "- mã khóa học " + body.course_id;

    const isFree = course.price === 0;
    const transId = generateTransactionId();

    if (isFree) {
      return null;
    }
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let vnp_Params = {};
    let vnpUrl = this.configService.VnpayConfig.vnp_VNPayUrl;

    vnp_Params["vnp_Version"] = this.configService.VnpayConfig.vnp_Version;
    vnp_Params["vnp_Command"] = this.configService.VnpayConfig.vnp_Command;
    vnp_Params["vnp_TmnCode"] = this.configService.VnpayConfig.vnp_TmnCode;
    vnp_Params["vnp_Locale"] = this.configService.VnpayConfig.vnp_Locale;
    vnp_Params["vnp_CurrCode"] = this.configService.VnpayConfig.vnp_CurrCode;
    vnp_Params["vnp_TxnRef"] = transId;
    vnp_Params["vnp_OrderInfo"] = description;
    vnp_Params["vnp_OrderType"] = "190000"; // Mã đào tạo
    vnp_Params["vnp_Amount"] = course.price * 100;
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

    await this.transactionService.createTransaction({
      id: transId,
      user_id: req.user.id,
      type: TransactionType.CUSTOMER_PAY,
      course_id: body.course_id,
      payment_method: body.payment_method,
      amount: course.price,
      course_name: course.name,
      description: description,
      status: isFree ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
      gen_secure_hash: signed,
    });

    return vnpUrl;
  }

  async vnpayIpn(req: any) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let transactionId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    let vnpAmount = vnp_Params["vnp_Amount"];
    const vnp_TransactionNo = vnp_Params["vnp_TransactionNo"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = this.configService.VnpayConfig.vnp_HashSecret;

    let querystring = require("qs");

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    const transaction = await this.transactionService.getTransactionById(transactionId);
    if (secureHash === signed && transaction?.gen_secure_hash !== secureHash) {
      if (transaction) {
        if (vnpAmount / 100 === transaction.amount) {
          if (transaction.status === TransactionStatus.PENDING) {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == "00") {
              await this.transactionService.transactionSuccess(transactionId, vnp_TransactionNo);
              return { RspCode: "00", Message: "Success" };
            } else {
              await this.transactionService.transactionFail(
                transactionId,
                vnp_TransactionNo,
                rspCode,
              );
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

  async vnpayRefund(transaction: TransactionEntity) {
    process.env.TZ = "Asia/Ho_Chi_Minh";
    let date = new Date();

    let crypto = require("crypto");

    let vnp_TmnCode = this.configService.VnpayConfig.vnp_TmnCode;
    let secretKey = this.configService.VnpayConfig.vnp_HashSecret;

    let vnp_TxnRef = transaction.id;
    let vnp_TransactionDate = transaction.created_at;
    let vnp_Amount = transaction.amount * 100;
    let vnp_TransactionType = "02"; // 02: Giao dịch hoàn trả toàn phần (vnp_TransactionType=02)
    let vnp_CreateBy = "CodeDrafts";

    let currCode = "VND";

    let vnp_RequestId = moment(date).format("HHmmss");
    let vnp_Version = this.configService.VnpayConfig.vnp_Version;
    let vnp_Command = "refund";
    let vnp_OrderInfo = "CodeDrafts hoan tien GD ma:" + vnp_TxnRef;

    let vnp_IpAddr = "127.0.0.1";

    let vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

    let vnp_TransactionNo = transaction.trans_no;

    let data =
      vnp_RequestId +
      "|" +
      vnp_Version +
      "|" +
      vnp_Command +
      "|" +
      vnp_TmnCode +
      "|" +
      vnp_TransactionType +
      "|" +
      vnp_TxnRef +
      "|" +
      vnp_Amount +
      "|" +
      vnp_TransactionNo +
      "|" +
      vnp_TransactionDate +
      "|" +
      vnp_CreateBy +
      "|" +
      vnp_CreateDate +
      "|" +
      vnp_IpAddr +
      "|" +
      vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

    let dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: vnp_Version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: vnp_TmnCode,
      vnp_TransactionType: vnp_TransactionType,
      vnp_TxnRef: vnp_TxnRef,
      vnp_Amount: vnp_Amount,
      vnp_TransactionNo: vnp_TransactionNo,
      vnp_CreateBy: vnp_CreateBy,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_TransactionDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: vnp_IpAddr,
      vnp_SecureHash: vnp_SecureHash,
    };

    const r = await axios.post(this.configService.VnpayConfig.vnp_VNPayUrl, dataObj);

    // request({
    //     url: vnp_Api,
    //     method: "POST",
    //     json: true,
    //     body: dataObj
    //         }, function (error, response, body){
    //             console.log(response);
    //         });
  }

  async calculate(body: CalculateRequestDto) {
    const course = await this.courseService.getCourseById(body.course_id);
    if (!course)
      throw new CustomHttpException({
        message: "Không tìm thấy khóa học",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    let discount = 0;
    // const price = course.price;
    // const promotion = await this.courseService.getPromotionByCode(body.promotion_code);
    // if (promotion) {
    //   if (promotion.type === "percent") {
    //     return price - (price * promotion.discount) / 100;
    //   } else if (promotion.type === "amount") {
    //     return price - promotion.discount;
    //   }
    // }
    return {
      price: course.price,
      discount: discount,
      total: course.price - discount,
    };
  }
}
