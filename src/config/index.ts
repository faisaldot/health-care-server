import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  nodeEnv: process.env.NODE_ENV as string,
  port: process.env.PORT as string,
  databaseUrl: process.env.DATABASE_URL as string,
};
