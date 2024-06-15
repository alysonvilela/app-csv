import { subscribe, publish } from "pubsub-js";
import { CSVModel } from "../../domain/csv-model";
import { asyncScheduler } from "rxjs";
import { SendEmailCommand } from "../../services/send-email";

export class EmailQueueSingleton {
    private static instance: EmailQueueSingleton | null = null
    private topic = "email-queue";

    private constructor(private readonly command: (data: CSVModel) => Promise<void>) {
        subscribe(this.topic, (_topic, data) => {
            asyncScheduler.schedule(async() => {
                await this.command(data as unknown as CSVModel)
            })
        })
    }

    public static getInstance(): EmailQueueSingleton {
        if (!this.instance) {
            const execute = new SendEmailCommand().execute
            this.instance = new EmailQueueSingleton(execute);
        }

        return this.instance;
    }

    public pub(data: CSVModel) {
        publish(this.topic, data)
    }
}