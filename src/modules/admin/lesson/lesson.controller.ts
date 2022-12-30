import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateLessonDto } from "./lesson.dto";
import { LessonService } from "./lesson.service";

@Controller("admin/lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Post("/")
  async createLesson(@Body() body: CreateLessonDto) {
    return await this.lessonService.createLesson(body);
  }

  @Get("/:lesson_id")
  async getLessons(@Param("lesson_id") lesson_id: number) {
    return await this.lessonService.getLessons(lesson_id);
  }
}
