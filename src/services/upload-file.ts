
import { createReadStream } from "node:fs";
import * as csv from "fast-csv";
import { asyncScheduler, bufferCount, from } from "rxjs";
import { LoggerSingleton } from "../lib/logger";
import { CSVModel } from "../domain/csv-model";
import { InvoiceQueueSingleton } from "../lib/queues/invoice-queue";

export class UploadFileUseCase {

    constructor(
        private readonly logger: LoggerSingleton,
        private readonly invoiceQueue: InvoiceQueueSingleton
    ) { }

    async execute(filePath: string) {
        const startTime = new Date().getTime()
        this.logger.log(`startedtime`, new Date().toISOString())
        const file = createReadStream(filePath).pipe(
            csv.parse({ headers: false })
        );

        const logger = this.logger
        const invoiceQueue = this.invoiceQueue

        from(file)
            .pipe(bufferCount(10000))
            .subscribe({
                next(value: CSVModel[]) {
                    logger.log(`${UploadFileUseCase.name}`, "run 10000");

                    asyncScheduler.schedule(async () => {
                      for (const item of value) {
                        invoiceQueue.pub(item)
                      }
                    })
                },
                error(err) {
                    logger.log(`${UploadFileUseCase.name} error`, err);
                },
                complete() {
                    const endTime = new Date().getTime();
                    const timeDifference = endTime - startTime;
                    const seconds = timeDifference / 1000
                    logger.log(`${UploadFileUseCase.name}`, ["complete.", "Time spent (in seconds):", seconds]);
                },
            });
    }
}