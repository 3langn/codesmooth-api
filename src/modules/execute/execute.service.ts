import { Injectable } from "@nestjs/common";
import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import * as sh from "child_process";
import { generateId } from "../../common/generate-nanoid";
import { genPath } from "../../common/constants/path";

@Injectable()
export class ExecuteService {
  async execute(
    code: string,
    testCode: string,
    executeCode: string,
    language: string
  ) {
    const id = generateId(10);
    const filePath = this.genFile(id, code, testCode, executeCode, language);
    const output = sh.execSync(
      this.getCMD(language, id, this.getExt(language)),
      {
        encoding: "utf-8",
        shell: "/bin/bash",
      }
    );
    fs.unlinkSync(filePath);
    return JSON.parse(output).test_results;
  }

  private genFile(
    id: number,
    code: string,
    testCode: string,
    executeCode: string,
    language: string
  ): string {
    let r = code + "\n" + testCode + "\n" + executeCode;
    if (!fs.existsSync(genPath)) {
      fs.mkdirSync(genPath);
    }
    const filePath = `${genPath}/${id}.${this.getExt(language)}`;
    fs.writeFileSync(filePath, r);
    return filePath;
  }

  private getExt(language: string): string {
    switch (language) {
      case "typescript":
        return `ts`;
      case "c++":
        return `cpp`;
      default:
        return `ts`;
    }
  }

  private getCMD(language: string, id: number, ext: string): string {
    switch (language) {
      case "typescript":
        return `npx ts-node ${genPath}/${id}.${ext}`;
      case "c++":
        return `g++ ${genPath}/${id}.${ext} -o ${genPath}/${id}; ${genPath}/${id}`;
      default:
        return `npx ts-node ${genPath}/${id}.${ext}`;
    }
  }
}
