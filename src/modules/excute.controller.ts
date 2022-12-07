import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller("/execute")
export class ExcuteController {
  @Post("/javascript")
  async excuteJavascript(
    @Body() { code, testCode }: { code: string; testCode: string },
  ) {
    const e = `${code} ${testCode};return executeTest()`;
    console.log(e);

    return new Function(e)();
  }
}
