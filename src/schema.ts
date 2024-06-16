import { serial, text, pgTable, uuid } from "drizzle-orm/pg-core";


export const client = pgTable("client", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").unique(),
    governmentId: text("governmentId"),
    debtAmount: serial("debtAmount"),
    debtDueDate: text("debtDueDate"),
    debtId: text("debtId"),
});

export type Client = typeof client.$inferSelect;