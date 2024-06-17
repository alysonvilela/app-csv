import { ulid } from "ulidx";
import { CSVModel } from "../../domain/csv-model";
import { db } from "../../lib/db";
import { Client, client } from "../../schema";
import { ClientRepository, PaginatedParams } from "./client.repository";
import { LoggerSingleton } from "../../lib/logger";
import { sql } from "drizzle-orm";

export class PgClientRepository implements ClientRepository {
  constructor(private readonly logger: LoggerSingleton) {}
  async queryAllCount(): Promise<number> {
    try {
      this.logger.log(PgClientRepository.name, "Running query all count");
      const [{ count }] = await db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(client);
      return count;
    } catch (err) {
      this.logger.log(PgClientRepository.name, "FAIL on query all count");
      return 0;
    }
  }

  async queryAll(params: PaginatedParams): Promise<Client[]> {
    try {
      this.logger.log(PgClientRepository.name, "Running query all");

      const clients = await db.query.client.findMany({
        orderBy: (clients, { asc }) => asc(clients.id),
        limit: params.pageSize,
        offset: (params.page - 1) * params.pageSize,
      });

      return clients;
    } catch (err) {
      this.logger.log(PgClientRepository.name, "FAIL on query all");
      return [];
    }
  }
  async insertMultiple(data: CSVModel[]): Promise<void> {
    try {
      this.logger.log(PgClientRepository.name, "Running insert multiple");
      await db
        .insert(client)
        .values(
          data.map(
            ({
              debtAmount,
              debtDueDate,
              debtId,
              email,
              governmentId,
              name,
            }) => ({
              id: ulid(),
              name,
              email,
              debtAmount,
              debtId,
              debtDueDate: String(debtDueDate),
              governmentId: governmentId.toString(),
            }),
          ),
        )
        .onConflictDoNothing();
    } catch (err) {
      this.logger.log(PgClientRepository.name, "FAIL on insert multiple");
    }
  }
}
