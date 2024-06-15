import { asyncScheduler } from "rxjs";
import { CSVModel } from "../domain/csv-model";
import { InvoiceQueueSingleton } from "../lib/queues/invoice-queue";

export class BulkDbInsertCommand {
    constructor(private readonly invoiceQueue: InvoiceQueueSingleton) { }

    async execute(data: CSVModel[]) {
        await new Promise((res) => setTimeout(res, 5000))
        asyncScheduler.schedule(async () => {
            for (const item of data) {
                this.invoiceQueue.pub(item)
            }
        })
    }
}