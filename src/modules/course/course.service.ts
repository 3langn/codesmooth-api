import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { CategoryEntity } from "../../entities/category.entity";
import { queryPagination, splitAndReturnSecondPart } from "../../common/utils";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { CourseStatus } from "../../common/enum/course";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { CourseReponseDto } from "./dto/course-response.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async getCourses(pageOptionsDto: PageOptionsDto): Promise<[CourseEntity[], number]> {
    const qb = this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "categories.id",
        "categories.name",
        "owner.id",
        "owner.username",
        "owner.email",
        "owner.avatar",
        "categories.id",
        "categories.name",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .where("course.status = :status", { status: CourseStatus.Published })
      .andWhere("course.published_at IS NOT NULL")
      .andWhere("course.deleted_at IS NULL");

    if (pageOptionsDto.category_id) {
      qb.andWhere("categories.id = :category_id", { category_id: pageOptionsDto.category_id });
    }

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async getMyCourses(
    pageOptionsDto: PageOptionsDto,
    user_id: number,
  ): Promise<[CourseEntity[], number]> {
    const qb = this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "categories.id",
        "categories.name",
        "owner.id",
        "owner.username",
        "owner.email",
        "owner.avatar",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .leftJoin("course.students", "students")
      .where("course.status = :status", { status: CourseStatus.Published })
      .andWhere("students.id = :user_id", { user_id })
      .andWhere("course.published_at IS NOT NULL")
      .andWhere("course.deleted_at IS NULL");

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async getCourseById(id: number, user_id?: number): Promise<CourseReponseDto> {
    // check lesson is completed by user
    const qb = this.courseRepository.createQueryBuilder("course");
    const result = await qb
      .select([
        "course",
        "sections",
        "lessons",
        "categories",
        "owner",
        "COUNT(completed_lessons.lesson_id) AS count_completed",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.main_category", "main_category")
      .leftJoin("course.owner", "owner")
      .leftJoin("course.sections", "sections")
      .leftJoin("sections.lessons", "lessons")
      .leftJoin(
        "userscompleted_lessons",
        "completed_lessons",
        "completed_lessons.lesson_id = lessons.id AND completed_lessons.user_id = :userId",
        { userId: user_id },
      )
      .where("course.status = :status", { status: CourseStatus.Published })
      .andWhere("course.id = :id", { id })
      .andWhere("course.published_at IS NOT NULL")
      .andWhere("course.deleted_at IS NULL")
      .groupBy("course.id, categories.id, owner.id, sections.id, lessons.id")
      .orderBy("sections.order", "ASC")
      .addOrderBy("lessons.order", "ASC")
      .getRawMany();

    // Xử lý dữ liệu để trả về định dạng yêu cầu
    let formattedResult: CourseReponseDto;
    let currentCourse = null;
    let currentSection = null;

    for (const row of result) {
      if (!currentCourse || currentCourse.id !== row.course_id) {
        currentCourse = {
          sections: [],
          owner: {},
          categories: [],
        };

        for (const key in row) {
          if (key.includes("course_")) currentCourse[splitAndReturnSecondPart(key)] = row[key];
          if (key.includes("owner_")) {
            currentCourse.owner["id"] = row["owner_id"];
            currentCourse.owner["username"] = row["owner_username"];
            currentCourse.owner["email"] = row["owner_email"];
            currentCourse.owner["avatar"] = row["owner_avatar"];
            console.log(currentCourse.owner);
          }
          if (key.includes("categories_"))
            currentCourse.categories[splitAndReturnSecondPart(key)] = row[key];
        }

        formattedResult = currentCourse;
        currentSection = null;
      }

      if (!currentSection || currentSection.id !== row.sections_id) {
        currentSection = {
          lessons: [],
        };
        for (const key in row) {
          if (key.includes("sections_")) currentSection[splitAndReturnSecondPart(key)] = row[key];
        }
        currentCourse.sections.push(currentSection);
      }

      currentSection.lessons.push({
        id: row.lessons_id,
        title: row.lessons_title,
        summary: row.lessons_summary,
        section_id: row.lessons_section_id,
        course_id: row.lessons_course_id,
        order: parseInt(row.lessons_order),
        components: row.lessons_components,
        is_completed: parseInt(row.count_completed) > 0,
      });
    }

    let count = 0;
    if (user_id) {
      count = await this.datasource.createEntityManager().count("course_student", {
        where: {
          student_id: user_id,
          course_id: id,
        },
      });
    }

    if (!formattedResult)
      throw new CustomHttpException({
        message: "Không tìm thấy khóa học",
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.NotFound,
      });

    const main_category = await this.categoryRepository.findOne({
      where: { id: formattedResult.main_category_id },
    });

    return {
      ...formattedResult,
      main_category,
      is_bought: count > 0,
    };
  }
}
