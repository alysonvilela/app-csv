import { CSVModel } from "../domain/csv-model";
import { LoggerSingleton } from "../lib/logger";
import { SendEmailCommand } from "./send-email";

describe(SendEmailCommand.name, () => {
  let logger: LoggerSingleton;
  let iot: SendEmailCommand;

  beforeEach(() => {
    logger = {
      log: vi.fn(),
    };
    iot = new SendEmailCommand(logger);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("(ORCHESTRATION) should end the process not calling nothing", async () => {
    const data: CSVModel = {
      debtAmount: 1,
      debtDueDate: new Date(),
      debtId: "1",
      email: "1",
      governmentId: 1,
      name: "1",
    };

    await expect(iot.execute(data)).resolves.not.toThrow();
  });
});
