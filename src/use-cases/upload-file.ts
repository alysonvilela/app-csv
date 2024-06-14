
import { createReadStream } from "node:fs";
import * as csv from "fast-csv";
import { asyncScheduler, bufferCount, from } from "rxjs";
import { LoggerSingleton } from "../utils/logger";
import { CSVModel } from "../domain/csv-model";
import { Context } from "hono";

export class UploadFileUseCase {

    constructor(private readonly logger: LoggerSingleton) { }

    async execute(filePath: string) {
        const startedtime = new Date().toISOString()
        this.logger.log(`startedtime`, new Date().toISOString())
        const file = createReadStream(filePath).pipe(
            csv.parse({ headers: false })
        );

        const logger = this.logger

        from(file)
            .pipe(bufferCount(10000))
            .subscribe({
                next(value: CSVModel[]) {
                    logger.log(`${UploadFileUseCase.name}`, "run 10000");

        

                    // asyncScheduler.schedule(async () => {
                    //     // SEND 1000 DATA TO DATABASE
                    // })
                },
                error(err) {
                    logger.log(`${UploadFileUseCase.name} error`, err);
                },
                complete() {
                    logger.log(`${UploadFileUseCase.name}`, "complete " + "start: " + startedtime+ ", end: " + new Date().toISOString());
                },
            });
    }
}