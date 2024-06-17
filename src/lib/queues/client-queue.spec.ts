import * as PubSub from "pubsub-js";
import { ClientQueueSingleton } from "./client-queue";
import { BulkDbInsertCommand } from "../../services/bulk-db-insert";

let publish = vi.fn();
let subscribe = vi.fn();

vi.mock("pubsub-js");
vi.mock("pubsub-js", async (importOriginal) => {
  const old = await importOriginal<typeof import("pubsub-js")>();
  return {
    ...old,
    clearAllSubscriptions: old.clearAllSubscriptions,
    publish: (...args: any[]) => publish(...args),
    subscribe: (...args: any[]) => subscribe(...args),
  };
});

describe(ClientQueueSingleton.name, () => {
  let subscribeResolver = vi.fn().mockResolvedValue({});
  let iot: ClientQueueSingleton;

  beforeEach(() => {
    iot = new ClientQueueSingleton(subscribeResolver);

    vi.spyOn(BulkDbInsertCommand.prototype, "execute").mockImplementation(
      async (...args) => {
        subscribeResolver(args);
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    PubSub.clearAllSubscriptions();
  });

  it("should call resolver when a publish happen", async () => {
    const data = {
      debtAmount: 1,
      debtDueDate: new Date(),
      debtId: "1",
      email: "1",
      governmentId: 1,
      name: "1",
    };

    iot.pub([data]);

    expect(publish).toBeCalledWith(iot.topic, [data]);
    expect(subscribe).toBeCalledWith(iot.topic, expect.any(Function));
  });
});
