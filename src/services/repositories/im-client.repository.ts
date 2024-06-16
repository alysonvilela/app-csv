import { ulid } from "ulidx";
import { CSVModel } from "../../domain/csv-model";
import { ClientRepository, PaginatedParams } from "./client.repository";
import { Client } from "../../schema";

export class InMemoryClientRepository implements ClientRepository {
    db: Client[] = []

    constructor() { }
    async queryAllCount(): Promise<number> {
        return this.db.length
    }

    async insertMultiple(data: CSVModel[]): Promise<void> {
        this.db.push(...data.map((i): Client => ({
            id: ulid(),
            debtAmount: i.debtAmount,
            debtDueDate: i.debtDueDate.toISOString(),
            debtId: i.debtId,
            email: i.email,
            governmentId: i.governmentId.toString(),
            name: i.name
        })))
    }

    async queryAll(params: PaginatedParams): Promise<Client[]> {
        return this.db.slice((params.page - 1) * params.pageSize, params.page * params.pageSize)
    }
}