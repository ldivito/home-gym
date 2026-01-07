import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as equipmentSchema from "@/db/schema/equipment";

const client = postgres(process.env.DATABASE_URL!);

export const equipmentDb = drizzle(client, { schema: equipmentSchema });
