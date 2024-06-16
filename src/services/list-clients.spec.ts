import { LoggerSingleton } from "../lib/logger"
import { Client } from "../schema"
import { ListClientsUseCase } from "./list-clients"
import { ClientRepository } from "./repositories/client.repository"
import { InMemoryClientRepository } from "./repositories/im-client.repository"

describe(ListClientsUseCase.name, () => {
    let logger: LoggerSingleton
    let clientRepository: ClientRepository
    let iot: ListClientsUseCase

    beforeEach(() => {
        logger = {
            log: vi.fn()
        }
        clientRepository = new InMemoryClientRepository()
        iot = new ListClientsUseCase(logger, clientRepository)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should list paginated clients', async () => {
        const data: Client = {
            debtAmount: 1,
            debtDueDate: new Date().toISOString(),
            debtId: "1",
            email: "1",
            governmentId: '1',
            name: "1",
            id: '1'
        }

        const repo = clientRepository as InMemoryClientRepository
        repo.db

        const mockedData: Client[] = [...(Array.from({
            length: 12,
        }).fill(data) as Client[]).map((val: Client, idx) => ({
            ...val,
            id: String(idx + 1)
        }))]

        repo.db = mockedData

        const res = await iot.execute({ page: 1, pageSize: 10 })
        expect(res).toHaveLength(10)

        const res2 = await iot.execute({ page: 2, pageSize: 10 })
        expect(res2).toHaveLength(2)
    })

})