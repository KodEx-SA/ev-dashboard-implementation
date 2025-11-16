import { defineConfig } from "@prisma/config";
import { config } from "dotenv";

// Load .env.local for Next.js projects
config({ path: ".env.local" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
});



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
