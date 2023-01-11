import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ResponseDefault } from "../../../common/dto/response_default";
import {
  SaveLessonDto as SaveLessonDto,
  MarkLessonAsCompletedDto,
  SwapOrderRequestDto,
  UpdateLessonsOrder,
} from "./lesson.dto";
import { LessonService } from "./lesson.service";

@Controller("admin/lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Post("/")
  async saveLesson(@Body() body: SaveLessonDto) {
    const res = await this.lessonService.saveLesson(body);
    return new ResponseDefault("Lesson saved successfully", res);
  }

  @Post("/add")
  async addLesson(@Body() body: SaveLessonDto) {
    const res = await this.lessonService.addLesson(body);
    return new ResponseDefault("Lesson added successfully", res);
  }

  @Get("/:lesson_id")
  async getLessons(@Param("lesson_id") lesson_id: number) {
    const res = await this.lessonService.getLessons(lesson_id);
    return new ResponseDefault("Success", res);
  }

  @Post("/mark-as-completed")
  async markLessonAsCompleted(
    @Body()
    req: MarkLessonAsCompletedDto,
  ) {
    const res = await this.lessonService.markLessonAsCompleted(req.lesson_id, req.isCompleted);

    return new ResponseDefault("Lesson marked as completed", res);
  }

  @Post("/swap-order")
  async swapOrder(@Body() req: SwapOrderRequestDto) {
    const res = await this.lessonService.swapOrder(req.lesson_id1, req.lesson_id2);
    return new ResponseDefault("Order swapped successfully", res);
  }

  @Delete("/:lesson_id")
  async deleteLessonById(@Param("lesson_id") lesson_id: number) {
    await this.lessonService.deleteLessonById(lesson_id);
    return new ResponseDefault("Lesson deleted successfully");
  }
}
