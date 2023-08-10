import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { Auth } from "../../../decorators";
import { ResponseDefault } from "../../../common/dto/response_default";
import { UserRole } from "../../../common/enum/user-role";

@Controller("admin/lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}
  @Auth([UserRole.ADMINSTRATOR])
  @Get("/:lesson_id")
  async getLesson(@Param("lesson_id") lesson_id: number) {
    const res = await this.lessonService.getLesson(lesson_id);
    return new ResponseDefault("Success", res);
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/get-lession-by-section-id/:section_id")
  async getLessonsBySectionId(@Param("section_id") section_id: number) {
    const res = await this.lessonService.getLessonsBySectionId(section_id);
    return new ResponseDefault("Success", res);
  }
}
