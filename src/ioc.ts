import { LoggerSingleton } from "./lib/logger";
import { InvoiceQueueSingleton } from "./lib/queues/invoice-queue";
import { ClientQueueSingleton } from "./lib/queues/client-queue";
import { EmailQueueSingleton } from "./lib/queues/email-queue";
import { PgClientRepository } from "./services/repositories/pg-client.repository";
import { BulkDbInsertCommand } from "./services/bulk-db-insert";
import { UploadFileUseCase } from "./services/upload-file";
import { UploadFileController } from "./controllers/upload-file-controller";

// Logger
export const logger = LoggerSingleton.getInstance();

// Repositories
export const clientRepository = new PgClientRepository(logger);

// Queues
export const emailQueue = EmailQueueSingleton.getInstance()
export const invoiceQueue = InvoiceQueueSingleton.getInstance()

export const bulkDbInsertCommand = new BulkDbInsertCommand(invoiceQueue, clientRepository)

export const clientQueue = ClientQueueSingleton.getInstance(bulkDbInsertCommand.execute)

// Commands
export const uploadFileUseCase = new UploadFileUseCase(logger, clientQueue)
export const uploadFileController = new UploadFileController(uploadFileUseCase)