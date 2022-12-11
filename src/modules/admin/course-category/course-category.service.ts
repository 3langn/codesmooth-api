import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseCategoryEntity } from "../../../entities/course-category.entity";
import { CreateCourseCategoryDto } from "./dto/dto";

@Injectable()
export class CourseCategoryService {
  constructor(
    @InjectRepository(CourseCategoryEntity)
    private courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {}

  async createCourseCategory(data: CreateCourseCategoryDto) {
    const cc = this.courseCategoryRepository.create(data);

    return await this.courseCategoryRepository.save(cc);
  }
}