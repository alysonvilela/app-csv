import { subscribe, publish } from "pubsub-js";
import { asyncScheduler } from "rxjs";
import { CSVModel } from "../../domain/csv-model";
import { BulkDbInsertCommand } from "../../services/bulk-db-insert";

export class ClientQueueSingleton {
    private static instance: ClientQueueSingleton | null = null
    public topic = "client-queue";

    constructor(
        private readonly command: BulkDbInsertCommand) {
        subscribe(this.topic, (_topic, data) => {
            asyncScheduler.schedule(async () => {
                await this.command.execute(data)
            })
        })
    }

    public static getInstance(command: BulkDbInsertCommand): ClientQueueSingleton {
        if (!this.instance) {
            this.instance = new ClientQueueSingleton(command);
        }

        return this.instance;
    }

    public pub(data: CSVModel[]) {
        publish(this.topic, data)
    }
}