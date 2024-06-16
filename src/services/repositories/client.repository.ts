import { CSVModel } from "../../domain/csv-model";
import { Client } from "../../schema";

export interface PaginatedParams {
    page: number
    pageSize: number
}

export abstract class ClientRepository {
    abstract insertMultiple(data: CSVModel[]): Promise<void>
    abstract queryAll(params: PaginatedParams): Promise<Client[]>
}