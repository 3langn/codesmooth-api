import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessionEntity } from "../../../entities/lession.entity";
import { CreateLessionDto } from "./lession.dto";
import { NotFoundException } from "src/common/exception/not-found.exception";
import { ExceptionTitleList } from "src/common/constants/exception-title-list.constants";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
@Injectable()
export class LessionService {
  constructor(
    @InjectRepository(LessionEntity)
    private lessionRepository: Repository<LessionEntity>
  ) {}

  async createLession(data: CreateLessionDto) {
    console.log(data);

    return await this.lessionRepository.upsert(data, { conflictPaths: ["id"] });
  }

  async getLessions(lession_id: number) {
    const lession = await this.lessionRepository.findOne({
      where: { id: lession_id },
    });
    if (!lession) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Lession ${lession_id} not found`,
        code: StatusCodesList.LessionNotFound,
      });
    }
    return lession;
  }
}
