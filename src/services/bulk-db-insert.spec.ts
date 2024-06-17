import { invoiceQueue } from "../ioc";
import { client } from "../schema";
import { BulkDbInsertCommand } from "./bulk-db-insert";
import { ClientRepository } from "./repositories/client.repository";
import { InMemoryClientRepository } from "./repositories/im-client.repository";

describe(BulkDbInsertCommand.name, () => {
  let clientRepository: ClientRepository;
  let iot: BulkDbInsertCommand;

  beforeEach(() => {
    clientRepository = new InMemoryClientRepository();
    iot = new BulkDbInsertCommand(invoiceQueue, clientRepository);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add multiple clients", async () => {
    const data = {
      debtAmount: 1,
      debtDueDate: new Date(),
      debtId: "1",
      email: "1",
      governmentId: 1,
      name: "1",
    };
    vi.spyOn(clientRepository, "insertMultiple");
    expect((clientRepository as InMemoryClientRepository).db).toHaveLength(0);

    await iot.execute([
      data,
      {
        ...data,
        email: "2",
      },
    ]);

    expect(clientRepository.insertMultiple).toBeCalledTimes(1);
    expect((clientRepository as InMemoryClientRepository).db).toHaveLength(2);
  });
});
