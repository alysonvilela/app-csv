import { subscribe, publish } from "pubsub-js";
import { MakeInvoiceCommand } from "../../services/make-invoice";
import { CSVModel } from "../../domain/csv-model";
import { asyncScheduler } from "rxjs";
import { EmailQueueSingleton } from "./email-queue";

export class InvoiceQueueSingleton {
    private static instance: InvoiceQueueSingleton | null = null
    private topic = "invoice-queue";

    private constructor(private readonly command: MakeInvoiceCommand) {
        subscribe(this.topic, (data) => {
            asyncScheduler.schedule(async() => {
                await this.command.execute(data as unknown as CSVModel)
            })
        })
    }

    public static getInstance(): InvoiceQueueSingleton {
        if (!this.instance) {
            const emailQueue = EmailQueueSingleton.getInstance()
            console.log(emailQueue)
            const command = new MakeInvoiceCommand(emailQueue)
            this.instance = new InvoiceQueueSingleton(command);
        }

        return this.instance;
    }

    public pub(data: CSVModel) {
        publish(this.topic, data)
    }
}