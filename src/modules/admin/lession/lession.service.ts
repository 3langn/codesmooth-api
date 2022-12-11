import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessionEntity } from "../../../entities/lession.entity";
import { CreateLessionDto } from "./lession.dto";

@Injectable()
export class LessionService {
  constructor(
    @InjectRepository(LessionEntity)
    private lessionRepository: Repository<LessionEntity>,
  ) {}

  async createLession(data: CreateLessionDto) {
    console.log(data);

    const lession = this.lessionRepository.create(data);
    return await this.lessionRepository.save(lession);
  }

  async getLessions(lession_id: number) {
    return await this.lessionRepository.findOne({ where: { id: lession_id } });
  }
}
