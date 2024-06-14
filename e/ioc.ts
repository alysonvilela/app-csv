// import { UploadFileController } from "./controllers/upload-file-controller";
import {  UploadFileController } from "./controllers/upload-file-controller";
import { UploadFileUseCase } from "./services/upload-file";
import { LoggerSingleton } from "./utils/logger";

export const logger = LoggerSingleton.getInstance();


const uploadFileUseCase = new UploadFileUseCase(logger)
export const uploadFileController = new UploadFileController(uploadFileUseCase)