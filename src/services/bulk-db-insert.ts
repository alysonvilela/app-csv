import { asyncScheduler } from "rxjs";
import { CSVModel } from "../domain/csv-model";
import { InvoiceQueueSingleton } from "../lib/queues/invoice-queue";
import { ClientRepository } from "./repositories/client.repository";

export class BulkDbInsertCommand {
    constructor(private readonly invoiceQueue: InvoiceQueueSingleton, private readonly clientRepository: ClientRepository) { }

    async execute(data: CSVModel[]) {
        await this.clientRepository.insertMultiple(data)

        asyncScheduler.schedule(async () => {
            for (const item of data) {
                this.invoiceQueue.pub(item)
            }
        })
    }
}