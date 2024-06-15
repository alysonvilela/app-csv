import { subscribe, publish } from "pubsub-js";
import { MakeInvoiceCommand } from "../../services/make-invoice";
import { CSVModel } from "../../domain/csv-model";
import { asyncScheduler } from "rxjs";
import { EmailQueueSingleton } from "./email-queue";

type Command = (data: CSVModel) => Promise<void>

export class InvoiceQueueSingleton {
    private static instance: InvoiceQueueSingleton | null = null
    public topic = "invoice-queue";

    constructor(private readonly command: Command) {
        subscribe(this.topic, (_topic, data: CSVModel) => {
            asyncScheduler.schedule(async() => {
                await this.command(data)
            })
        })
    }

    public static getInstance(command: Command): InvoiceQueueSingleton {
        if (!this.instance) {
            this.instance = new InvoiceQueueSingleton(command);
        }

        return this.instance;
    }

    public pub(data: CSVModel) {
        publish(this.topic, data)
    }
}