import { ulid } from "ulidx";
import { CSVModel } from "../../domain/csv-model";
import { db } from "../../lib/db";
import { client } from "../../schema";
import { ClientRepository } from "./client.repository";
import { LoggerSingleton } from "../../lib/logger";

export class PgClientRepository implements ClientRepository {
    constructor(private readonly logger: LoggerSingleton) {}
    async insertMultiple(data: CSVModel[]): Promise<void> {
        try {
            this.logger.log(PgClientRepository.name, 'Running insert multiple')
            await db.insert(client).values(data.map(({
                debtAmount,
                debtDueDate,
                debtId,
                email,
                governmentId,
                name
            }) => ({
                id: ulid(),
                name,
                email,
                debtAmount,
                debtId,
                debtDueDate: String(debtDueDate),
                governmentId: governmentId.toString(),
            }))).onConflictDoNothing();
        } catch(err) {
            this.logger.log(PgClientRepository.name, 'FAIL on insert multiple')
        }
    }
}