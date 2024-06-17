import { CSVModel } from "../domain/csv-model";
import { LoggerSingleton } from "../lib/logger";
import { EmailQueueSingleton } from "../lib/queues/email-queue";

let madeInvoices = 0;
export class MakeInvoiceCommand {
  constructor(
    private readonly logger: LoggerSingleton,
    private readonly sendEmailQueue: EmailQueueSingleton,
  ) {}

  async execute(data: CSVModel) {
    await new Promise((res) => setTimeout(res, 5000)); // It does simulates a hard processing (PDF MAKING) service running in background
    this.logger.log(MakeInvoiceCommand.name, ["made-invoices", madeInvoices++]);
    this.sendEmailQueue.pub(data);
  }
}
