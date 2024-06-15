
import * as csv from "fast-csv";
import { asyncScheduler, bufferCount, from } from "rxjs";
import { CSVModel } from "../domain/csv-model";
import { LoggerSingleton } from "../lib/logger";
import { Readable } from "node:stream";
import { ClientQueueSingleton } from "../lib/queues/client-queue";

export class UploadFileUseCase {

    constructor(
        private readonly logger: LoggerSingleton,
        private readonly queue: ClientQueueSingleton
    ) { }

    async execute(file: Readable) {
        const startTime = new Date().getTime()
        this.logger.log(`startedtime`, new Date().toISOString())
        const stream = file.pipe(
            csv.parse({ headers: true })
        );

        const logger = this.logger
        const queue = this.queue

        from(stream)
            .pipe(bufferCount(10000))
            .subscribe({
                next(value: CSVModel[]) {
                    logger.log(`${UploadFileUseCase.name}`, "run 10000");

                    asyncScheduler.schedule(async () => {
                        await queue.pub(value)
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