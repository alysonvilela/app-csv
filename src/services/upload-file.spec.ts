import { firstValueFrom } from "rxjs";
import { LoggerSingleton } from "../lib/logger";
import { ClientQueueSingleton } from "../lib/queues/client-queue";
import { UploadFileUseCase } from "./upload-file";
import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import { Logger } from "drizzle-orm";

let cb = vi.fn();

vi.spyOn(ClientQueueSingleton.getInstance(cb), "pub");

describe(UploadFileUseCase.name, () => {
  let logs = [];

  let logger: LoggerSingleton;
  let queueMock: ClientQueueSingleton;
  let iot: UploadFileUseCase;

  beforeEach(() => {
    logger = {
      log: (where, message) => logs.push(where, message),
    } as LoggerSingleton;
    queueMock = new ClientQueueSingleton(cb);
    iot = new UploadFileUseCase(logger, queueMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should call client queue", async () => {
    const rawData = readFileSync(process.cwd() + "/files/minimal.csv");
    iot.execute(Readable.from(rawData));

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(cb).toBeCalled();
  });
});
