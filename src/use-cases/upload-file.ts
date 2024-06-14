
import { createReadStream } from "node:fs";
import * as csv from "fast-csv";
import { asyncScheduler, bufferCount, from } from "rxjs";
import { LoggerSingleton } from "../utils/logger";
import { CSVModel } from "../domain/csv-model";

export class UploadFileUseCase {

    constructor(private readonly logger: LoggerSingleton) { }

    async execute(filePath: string) {
        const file = createReadStream(filePath).pipe(
            csv.parse({ headers: false })
        );

        const logger = this.logger

        from(file)
            .pipe(bufferCount(1000))
            .subscribe({
                next(value: CSVModel[]) {
                    logger.log(
                        `${UploadFileUseCase.name} processing line`,
                        JSON.stringify(value)
                    );

                    asyncScheduler.schedule(async () => {
                        // SEND 1000 DATA TO DATABASE
                        for(const item of value) {

                        }
                    })
                },
                error(err) {
                    logger.log(`${UploadFileUseCase.name} error`, err);
                },
                complete() {
                    logger.log(`${UploadFileUseCase.name}`, "complete");
                },
            });
    }
}