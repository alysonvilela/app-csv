import { subscribe, publish } from "pubsub-js";
import { CSVModel } from "../../domain/csv-model";
import { asyncScheduler } from "rxjs";

type Command = (data: CSVModel) => Promise<void>
export class EmailQueueSingleton {
    private static instance: EmailQueueSingleton | null = null
    public topic = "email-queue";

    constructor(private readonly command: Command) {
        subscribe(this.topic, (_topic, data: CSVModel) => {
            asyncScheduler.schedule(async() => {
                await this.command(data as unknown as CSVModel)
            })
        })
    }

    public static getInstance(command: Command): EmailQueueSingleton {
        if (!this.instance) {
            this.instance = new EmailQueueSingleton(command);
        }

        return this.instance;
    }

    public pub(data: CSVModel) {
        publish(this.topic, data)
    }
}