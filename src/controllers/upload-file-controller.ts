import { UploadFileUseCase } from "../services/upload-file";
import { FastifyReply, FastifyRequest } from "fastify";


export class UploadFileController {
    constructor(private readonly uploadFileUseCase: UploadFileUseCase) { }
    async handler(_req: FastifyRequest, reply: FastifyReply) {

        const filePath = process.cwd() + "/files/" + "example-input.csv"

        this.uploadFileUseCase.execute(filePath)

        return reply.code(200).send({
            success: true
        })
    }
}
