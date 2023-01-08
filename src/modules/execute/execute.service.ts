import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import * as sh from "child_process";
import { generateId } from "../../common/generate-nanoid";
import { genPath } from "../../common/constants/path";
import { SampleEntity } from "../../entities/sample.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ContentCode } from "../../entities/lesson.entity";

@Injectable()
export class ExecuteService {
  private logger = new Logger("ExecuteService");
  constructor(@InjectRepository(SampleEntity) private sampleRepo: Repository<SampleEntity>) {}

  async execute(code: string, testCode: string, language: string) {
    try {
      const id = generateId(10);
      const sampleRecord = await this.sampleRepo.findOne({
        where: {
          id: language,
        },
      });

      const componentContent = sampleRecord.content as ContentCode;
      const executeCode = componentContent.judgeContent.executeCode;

      const filePath = this.genFile(id, code, testCode, executeCode, language);

      let output: string;
      for (const cmd of this.getCMD(language, id, this.getExt(language))) {
        output = sh.execSync(cmd, {
          encoding: "utf-8",
          shell: "/bin/bash",
        });
        this.logger.debug(output);
      }

      fs.unlinkSync(filePath);
      return {
        results: JSON.parse(output).test_results,
        is_success: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        results: [],
        is_success: false,
        error: error.stderr,
      };
    }
  }

  private genFile(
    id: number,
    code: string,
    testCode: string,
    executeCode: string,
    language: string,
  ): string {
    let r = code + "\n" + testCode + "\n" + executeCode;
    const path = `${genPath}/${id}`;

    if (!fs.existsSync(genPath)) {
      fs.mkdirSync(genPath);
    }

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const filePath = `${path}/main.${this.getExt(language)}`;
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

  private getCMD(language: string, id: number, ext: string): string[] {
    const cdPath = `cd ${genPath}/${id};`;
    switch (language) {
      case "typescript":
        return [`${cdPath} npx ts-node main.${ext}`];
      case "c++":
        return [`${cdPath} g++ main.${ext} -o main;`, `${cdPath} ./main`];
      default:
        return [`${cdPath} npx ts-node main.${ext}`];
    }
  }
}
