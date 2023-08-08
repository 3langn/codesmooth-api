import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ResponseDefault } from "../../../common/dto/response_default";
import {
  AddLessonDto as AddLessonDto,
  MarkLessonAsCompletedDto,
  SaveLessonDto,
  SwapOrderRequestDto,
  UpdateLessonsOrder,
} from "./lesson.dto";
import { LessonService } from "./lesson.service";
import { Auth } from "../../../decorators";

@Controller("instructor/lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Auth()
  @Post("/")
  async saveLesson(@Body() body: SaveLessonDto, @Req() req: any) {
    // delay 1s
    const res = await this.lessonService.saveLesson(body, req.user.id);
    return new ResponseDefault("Lesson saved successfully", res);
  }

  @Auth()
  @Post("/add")
  async addLesson(@Body() body: AddLessonDto, @Req() req: any) {
    const res = await this.lessonService.addLesson(body, req.user.id);
    return new ResponseDefault("Lesson added successfully", res);
  }

  @Auth()
  @Get("/:lesson_id")
  async getLessons(@Param("lesson_id") lesson_id: number, @Req() req: any) {
    const res = await this.lessonService.getLessons(lesson_id, req.user.id);
    return new ResponseDefault("Success", res);
  }

  @Auth()
  @Get("/get-lession-by-section-id/:section_id")
  async getLessonsBySectionId(@Param("section_id") section_id: number, @Req() req: any) {
    const res = await this.lessonService.getLessonsBySectionId(section_id, req.user.id);
    return new ResponseDefault("Success", res);
  }

  // @Post("/mark-as-completed")
  // async markLessonAsCompleted(
  //   @Body()
  //   req: MarkLessonAsCompletedDto,
  // ) {
  //   const res = await this.lessonService.markLessonAsCompleted(req.lesson_id, req.isCompleted);

  //   return new ResponseDefault("Lesson marked as completed", res);
  // }

  // @Post("/swap-order")
  // async swapOrder(@Body() req: SwapOrderRequestDto) {
  //   const res = await this.lessonService.swapOrder(req.lesson_id1, req.lesson_id2);
  //   return new ResponseDefault("Order swapped successfully", res);
  // }

  @Auth()
  @Delete("/:lesson_id")
  async deleteLessonById(@Param("lesson_id") lesson_id: number, @Req() req: any) {
    await this.lessonService.deleteLessonById(lesson_id, req.user.id);
    return new ResponseDefault("Lesson deleted successfully");
  }
}
