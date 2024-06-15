import { z } from "zod";
import { UploadFileUseCase } from "../services/upload-file";
import { FastifyReply, FastifyRequest } from "fastify";
import { Readable } from "node:stream";

const dataDTO = z.object({
    fieldname: z.enum(["csv"]),
    file: z.instanceof(Readable),
})

export class UploadFileController {
    constructor(private readonly uploadFileUseCase: UploadFileUseCase) { }
    async handler(req: FastifyRequest, reply: FastifyReply) {

        const data = await req.file({
            limits: {
                fileSize: 1024 * 1024 * 1024, // 1GB,
            },
        })

        const { success, data: result, error } = dataDTO.safeParse(data)
        if (!success) {
            return reply.code(400).send({
                message: "Invalid file format"
            })
        }

        this.uploadFileUseCase.execute(result.file)

        return reply.code(200).send({
            success: true
        })
    }
}
