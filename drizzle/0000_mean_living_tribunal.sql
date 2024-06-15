CREATE TABLE IF NOT EXISTS "client" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"governmentId" text,
	"debtAmount" serial NOT NULL,
	"debtDueDate" text,
	"debtId" text
);
