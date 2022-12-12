import { Body, Controller, Get, Post } from "@nestjs/common";
import * as ts from "typescript";
import * as sh from "child_process";
import * as fs from "fs";
import * as path from "path";

import { generateId } from "../../common/generate-nanoid";
import { ExecuteService } from "./execute.service";
export class TestResult {
  input: string;
  reason: string;
  expected_output: string;
  actual_output: string;
  hide: boolean;
  success: boolean;
}

@Controller("/execute")
export class ExcuteController {
  constructor(private executeService: ExecuteService) {}

  @Post("/")
  async excute(
    @Body()
    {
      code,
      testCode,
      executeCode,
      language,
    }: {
      code: string;
      testCode: string;
      executeCode: string;
      language: string;
    }
  ) {
    return {
      data: await this.executeService.execute(
        code,
        testCode,
        executeCode,
        language
      ),
    };
  }
}
