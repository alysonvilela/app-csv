import { LoggerSingleton } from "./lib/logger";
import { InvoiceQueueSingleton } from "./lib/queues/invoice-queue";
import { EmailQueueSingleton } from "./lib/queues/email-queue";
import { ClientQueueSingleton } from "./lib/queues/client-queue";
// import { BulkDbInsertCommand } from "./services/bulk-db-insert";
import { UploadFileUseCase } from "./services/upload-file";
import { UploadFileController } from "./controllers/upload-file-controller";

export const logger = LoggerSingleton.getInstance();
export const emailQueue = EmailQueueSingleton.getInstance()
export const invoiceQueue = InvoiceQueueSingleton.getInstance()
export const clientQueue = ClientQueueSingleton.getInstance()

// export const bulkDbInsertCommand = new BulkDbInsertCommand(invoiceQueue)
export const uploadFileUseCase = new UploadFileUseCase(logger, clientQueue)
export const uploadFileController = new UploadFileController(uploadFileUseCase)