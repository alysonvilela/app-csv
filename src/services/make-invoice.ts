import { CSVModel } from "../domain/csv-model";
import { EmailQueueSingleton } from "../lib/queues/email-queue";

export class MakeInvoiceCommand {
    constructor(private readonly sendEmailQueue: EmailQueueSingleton) { }

    async execute(data: CSVModel) {
        await new Promise((res) => setTimeout(res, 5000))
        this.sendEmailQueue.pub(data)
    }
}