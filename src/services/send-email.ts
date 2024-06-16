import { unsubscribe } from "pubsub-js";
import { CSVModel } from "../domain/csv-model";
import { LoggerSingleton } from "../lib/logger";

let sentEmails = 0
export class SendEmailCommand {
    constructor(
        private readonly logger: LoggerSingleton
    ) {}

    async execute(_data: CSVModel) {
        await new Promise((res) => setTimeout(res, 5000))
        this.logger.log(SendEmailCommand.name, ["made-invoices", sentEmails++])
    }
}