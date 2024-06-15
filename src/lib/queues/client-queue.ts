import { subscribe, publish } from "pubsub-js";
import { asyncScheduler } from "rxjs";
import { CSVModel } from "../../domain/csv-model";
import { BulkDbInsertCommand } from "../../services/bulk-db-insert";
import { invoiceQueue } from "../../ioc";

export class ClientQueueSingleton {
    private static instance: ClientQueueSingleton | null = null
    private topic = "client-queue";

    private constructor(private readonly command: BulkDbInsertCommand) {
        subscribe(this.topic, (_topic, data) => {
            asyncScheduler.schedule(async() => {
                await this.command.execute(data)
            })
        })
    }

    public static getInstance(): ClientQueueSingleton {
        if (!this.instance) {
            const command = new BulkDbInsertCommand(invoiceQueue)
            this.instance = new ClientQueueSingleton(command);
        }

        return this.instance;
    }

    public pub(data: CSVModel[]) {
        publish(this.topic, data)
    }
}