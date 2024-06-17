import { subscribe, publish } from "pubsub-js";
import { asyncScheduler } from "rxjs";
import { CSVModel } from "../../domain/csv-model";

type Command = (data: CSVModel[]) => Promise<void>;
export class ClientQueueSingleton {
  private static instance: ClientQueueSingleton | null = null;
  public topic = "client-queue";

  constructor(private readonly command: Command) {
    subscribe(this.topic, (_topic, data) => {
      asyncScheduler.schedule(async () => {
        await this.command(data);
      });
    });
  }

  public static getInstance(command: Command): ClientQueueSingleton {
    if (!this.instance) {
      this.instance = new ClientQueueSingleton(command);
    }

    return this.instance;
  }

  public pub(data: CSVModel[]) {
    publish(this.topic, data);
  }
}
