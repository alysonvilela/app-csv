import { drizzle } from "drizzle-orm/postgres-js";
import postgres = require('postgres')
import { envs } from "../envs";
import * as schema from '../schema';

export const pg = postgres(envs.dbUrl);
export const db = drizzle(pg, { schema });

