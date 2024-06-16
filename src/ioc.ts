import { LoggerSingleton } from "./lib/logger";
import { InvoiceQueueSingleton } from "./lib/queues/invoice-queue";
import { ClientQueueSingleton } from "./lib/queues/client-queue";
import { EmailQueueSingleton } from "./lib/queues/email-queue";
import { PgClientRepository } from "./services/repositories/pg-client.repository";
import { BulkDbInsertCommand } from "./services/bulk-db-insert";
import { UploadFileUseCase } from "./services/upload-file";
import { UploadFileController } from "./controllers/upload-file-controller";
import { MakeInvoiceCommand } from "./services/make-invoice";
import { ListClientsUseCase } from "./services/list-clients";
import { ListClientsController } from "./controllers/list-clients-controller";

// Logger
export const logger = LoggerSingleton.getInstance();

// Repositories
export const clientRepository = new PgClientRepository(logger);

// Queues and callbacks
export const emailQueue = EmailQueueSingleton.getInstance()

export const makeInvoiceCommand = new MakeInvoiceCommand(logger, emailQueue)
export const invoiceQueue = InvoiceQueueSingleton.getInstance(makeInvoiceCommand.execute)

export const bulkDbInsertCommand = new BulkDbInsertCommand(invoiceQueue, clientRepository)
export const clientQueue = ClientQueueSingleton.getInstance(bulkDbInsertCommand.execute)

// Services
export const uploadFileUseCase = new UploadFileUseCase(logger, clientQueue)
export const listClientsUseCase = new ListClientsUseCase(logger, clientRepository)

// Commands
export const uploadFileController = new UploadFileController(uploadFileUseCase)
export const listClientsHistoryController = new ListClientsController(listClientsUseCase)