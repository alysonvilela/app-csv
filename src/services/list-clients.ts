import { LoggerSingleton } from "../lib/logger";
import { ClientRepository } from "./repositories/client.repository";

interface HistoryParams {
  page: number;
  pageSize: number;
}
export class ListClientsUseCase {
  constructor(
    private readonly logger: LoggerSingleton,
    private readonly clientRepository: ClientRepository,
  ) {}

  async execute(params: HistoryParams) {
    this.logger.log(ListClientsUseCase.name, "Running query all paginated");
    const count = await this.clientRepository.queryAllCount();

    const lastAvailablePage = Math.ceil(count / params.pageSize);
    if (params.page > lastAvailablePage) {
      return {
        data: [],
        total: count,
      };
    }

    if (count === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    const res = await this.clientRepository.queryAll(params);
    return {
      data: res,
      total: count,
    };
  }
}
