import { Context } from "hono";
import { UploadFileUseCase } from "../use-cases/upload-file";


export class UploadFileController {
    constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}
    async handler(ctx: Context) {

        const filePath = __dirname + "example-input.csv"

        await this.uploadFileUseCase.execute(filePath)
        
        return ctx.status(200)
    }
}