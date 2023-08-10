import { Module } from "@nestjs/common";
import { SampleModule } from "./sample/sample.module";
import { InstructorSectionModule } from "./section/section.module";
import { InstructorLessonModule } from "./lesson/lesson.module";
import { InstructorCourseModule } from "./course/course.module";

@Module({
  imports: [InstructorCourseModule, InstructorSectionModule, SampleModule, InstructorLessonModule],
})
export class InstructorModule {}
