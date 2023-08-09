import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth } from "../../decorators";
import { MarkLessonAsCompletedDto } from "../instructor/lesson/lesson.dto";

@Controller("lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}
  @Auth()
  @Get("/:lesson_id/:course_id")
  async getLesson(
    @Param("lesson_id") lesson_id: number,
    @Param("course_id") course_id: number,
    @Req() req: any,
  ) {
    const res = await this.lessonService.getLesson(lesson_id, course_id, req.user.id);
    return new ResponseDefault("Success", res);
  }

  @Auth()
  @Get("/get-lession-by-section-id/:section_id")
  async getLessonsBySectionId(@Param("section_id") section_id: number, @Req() req: any) {
    const res = await this.lessonService.getLessonsBySectionId(section_id, req.user.id);
    return new ResponseDefault("Success", res);
  }

  @Auth()
  @Post("/mark-as-completed")
  async markLessonAsCompleted(
    @Body()
    body: MarkLessonAsCompletedDto,
    @Req() req: any,
  ) {
    const res = await this.lessonService.markLessonAsCompleted(
      body.lesson_id,
      body.course_id,
      body.isCompleted,
      req.user,
    );

    return new ResponseDefault("Lesson marked as completed", res);
  }

  // @Post("/swap-order")
  // async swapOrder(@Body() req: SwapOrderRequestDto) {
  //   const res = await this.lessonService.swapOrder(req.lesson_id1, req.lesson_id2);
  //   return new ResponseDefault("Order swapped successfully", res);
  // }
}
