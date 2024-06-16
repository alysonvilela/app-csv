import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { ListClientsUseCase } from "../services/list-clients";

const paginationDTO = z.object({
    page: z.number().min(1),
    pageSize: z.number().min(10),
})

export class ListClientsController {
    constructor(private readonly listClientsUseCase: ListClientsUseCase) { }
    async handler(req: FastifyRequest, reply: FastifyReply) {
        const query = req.query

        const { success, data: result } = paginationDTO.safeParse(query)

        if (!success) {
            return reply.code(400).send({
                message: "Bad request!"
            })
        }

        const data = await this.listClientsUseCase.execute({
            page: result.page,
            pageSize: result.pageSize
        })

        return reply.code(200).send(data)
    }
}
