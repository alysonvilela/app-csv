import { UploadFileController } from "./controllers/upload-file-controller";
import { EmailQueueSingleton } from "./lib/queues/email-queue";
import { InvoiceQueueSingleton } from "./lib/queues/invoice-queue";
import { UploadFileUseCase } from "./services/upload-file";
import { LoggerSingleton } from "./lib/logger";

export const logger = LoggerSingleton.getInstance();
export const emailQueue = EmailQueueSingleton.getInstance()
export const invoiceQueue = InvoiceQueueSingleton.getInstance()

export const uploadFileUseCase = new UploadFileUseCase(logger, invoiceQueue)
export const uploadFileController = new UploadFileController(uploadFileUseCase)