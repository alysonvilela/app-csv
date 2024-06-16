import { FastifyReply, FastifyRequest } from "fastify";
import { ListClientsController } from "./list-clients-controller";
import { ListClientsUseCase } from "../services/list-clients";
import { InMemoryClientRepository } from "../services/repositories/im-client.repository";
import { ClientRepository } from "../services/repositories/client.repository";


describe(ListClientsController.name, () => {

    let reply: FastifyReply = {
        code: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis()
    } as unknown as FastifyReply

    let clientsRepository: ClientRepository
    let listClientsUseCase: ListClientsUseCase
    let iot: ListClientsController

    const SUCCESS = 200
    const FAILURE = 400

    beforeEach(() => {
        clientsRepository = new InMemoryClientRepository()
        listClientsUseCase = new ListClientsUseCase({
            log: vi.fn()
        }, clientsRepository)
        iot = new ListClientsController(listClientsUseCase)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should pass through a dto as get', async () => {
        const req = {
            query: {
                page: 1,
                pageSize: 10
            }
        } as unknown as FastifyRequest

        await iot.handler(req, reply)

        expect(reply.code).toBeCalledWith(SUCCESS)
        expect(reply.send).toBeCalledWith(expect.objectContaining({
            data: expect.any(Array),
            total: expect.any(Number)
        }))
    })

    it.each([
        [1, 9],
        [0, 10],
        ["1", 10], // Only numbers
    ])('should not be able to request with invalid query (PAGE: %i, PAGE_SIZE: %i)', async (
        page,
        pageSize
    ) => {
        const req = {
            query: {
                page,
                pageSize
            }
        } as unknown as FastifyRequest

        await iot.handler(req, reply)

        expect(reply.code).toBeCalledWith(FAILURE)
    })
})