import { Body, Controller, Get, Post } from "@nestjs/common";
import * as ts from "typescript";
import * as sh from "child_process";
import * as fs from "fs";
export class TestReslt {
  input: string;
  reason: string;
  expected_output: string;
  actual_output: string;
  hide: boolean;
  success: boolean;
}

@Controller("/execute")
export class ExcuteController {
  @Post("/typescript")
  async excuteJavascript(
    @Body()
    {
      code,
      testCode,
      executeCode,
    }: {
      code: string;
      testCode: string;
      executeCode: string;
    },
  ) {
    let r = code + "\n" + testCode + "\n" + executeCode;
    fs.writeFileSync("testtype.ts", r);

    const cmd = "tsc testtype.ts";

    const output1 = sh.execSync(cmd, {
      encoding: "utf-8",
      shell: "/bin/bash",
    });

    console.log("Output was:\n", output1);

    const output = sh.execSync("node testtype.js", {
      encoding: "utf-8",
      shell: "/bin/bash",
    }); // the default is 'buffer'

    console.log("Output was:\n", output);

    return { data: JSON.parse(output).test_results };
  }

  @Post("/c")
  async excuteC(
    @Body()
    {
      code,
      testCode,
      executeCode,
    }: {
      code: string;
      testCode: string;
      executeCode: string;
    },
  ) {
    let r = code + "\n" + testCode + "\n" + executeCode;

    fs.writeFileSync("test2.cpp", r);

    const cmd =
      "/usr/bin/g++ -fdiagnostics-color=always -g /home/titus/Desktop/Projects/codesmooth/backend/test2.cpp -o /home/titus/Desktop/Projects/codesmooth/backend/test2";

    const output1 = sh.execSync(cmd, {
      encoding: "utf-8",
      shell: "/bin/bash",
    });

    console.log("Output was:\n", output1);

    const output = sh.execSync("./test2", {
      encoding: "utf-8",
      shell: "/bin/bash",
    }); // the default is 'buffer'

    console.log("Output was:\n", output);

    const TestResult = JSON.parse(output);
    console.log("Output was:\n", TestResult);

    return { data: JSON.parse(output).test_results };
  }
}
