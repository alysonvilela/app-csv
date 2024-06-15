import { ulid } from "ulidx";
import { CSVModel } from "../../domain/csv-model";
import { db } from "../../lib/db";
import { ClientRepository } from "./client.repository";
import { LoggerSingleton } from "../../lib/logger";

export class InMemoryClientRepository implements ClientRepository {
    db: CSVModel[] = []

    constructor() {}
    async insertMultiple(data: CSVModel[]): Promise<void> {
       this.db.push(...data)
    }
}