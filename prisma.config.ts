import { config } from "dotenv";

// local & production environments
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
config({ path: envFile });
// config({ path: ".env.production" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
});




function defineConfig(arg0: { schema: string; }) {
  throw new Error("Function not implemented.");
}
// import { defineConfig, env } from "prisma/config";
// import "dotenv/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   engine: "classic",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });
