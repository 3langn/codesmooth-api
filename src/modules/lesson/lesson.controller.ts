import { Controller, Get, Param, Req } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth } from "../../decorators";

@Controller("lesson")
export class LessonController {
  constructor(private lessonService: LessonService) {}
  @Auth()
  @Get("/:lesson_id")
  async getLessons(@Param("lesson_id") lesson_id: number, @Req() req: any) {
    console.log("lesson_id", req.user.id);

    const res = await this.lessonService.getLesson(lesson_id, req.user.id);
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
}