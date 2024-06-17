import { LoggerSingleton } from "./logger";

let consoleMock = vi.fn();

describe(LoggerSingleton.name, () => {
  let iot: LoggerSingleton;

  beforeEach(() => {
    iot = LoggerSingleton.getInstance();
    vi.spyOn(global.console, "log").mockImplementation(consoleMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should produce pretty logs", async () => {
    const someArgument = ["value: ", 1];
    iot.log("testing", someArgument);
    expect(consoleMock).toBeCalledWith("[TESTING]: ", someArgument);
  });
});
