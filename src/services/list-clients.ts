
import { LoggerSingleton } from "../lib/logger";
import { ClientRepository } from "./repositories/client.repository";

interface HistoryParams {
    page: number,
    pageSize: number
}
export class ListClientsUseCase {

    constructor(
        private readonly logger: LoggerSingleton,
        private readonly clientRepository: ClientRepository
    ) { }

    async execute(params: HistoryParams) {
        this.logger.log(ListClientsUseCase.name, 'Running query all paginated')
        const res = await this.clientRepository.queryAll(params)
        return res
    }
}