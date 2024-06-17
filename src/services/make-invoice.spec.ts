import { CSVModel } from "../domain/csv-model";
import { LoggerSingleton } from "../lib/logger";
import { EmailQueueSingleton } from "../lib/queues/email-queue";
import { MakeInvoiceCommand } from "./make-invoice";

describe(MakeInvoiceCommand.name, () => {
  let logger: LoggerSingleton;
  let queue: EmailQueueSingleton;
  let iot: MakeInvoiceCommand;

  beforeEach(() => {
    logger = {
      log: vi.fn(),
    };
    queue = {
      pub: vi.fn(),
    } as unknown as EmailQueueSingleton;

    iot = new MakeInvoiceCommand(logger, queue);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("(ORCHESTRATION) should call the next queue after process done", async () => {
    const data: CSVModel = {
      debtAmount: 1,
      debtDueDate: new Date(),
      debtId: "1",
      email: "1",
      governmentId: 1,
      name: "1",
    };

    await iot.execute(data);
    expect(queue.pub).toHaveBeenCalledWith(data);
  });
});
