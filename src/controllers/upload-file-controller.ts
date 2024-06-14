import { Context } from "hono";
import { UploadFileUseCase } from "../use-cases/upload-file";


export class UploadFileController {
    constructor(private readonly uploadFileUseCase: UploadFileUseCase) { }
    async handler(ctx: Context) {

        const filePath = process.cwd() + "/files/" + "example-input.csv"

        this.uploadFileUseCase.execute(filePath)

        return ctx.json({
            success: true
        })
    }
}
