import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require('postgres')
import { envs } from "../envs";

export const pg = postgres(envs.dbUrl);
export const db = drizzle(pg);

