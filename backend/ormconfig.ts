import { env } from "./src/utils/wrappers/env-wrapper";

export default {
  type: "postgres",
  host: env.pg.host,
  port: env.pg.port,
  username: env.pg.username,
  password: env.pg.password,
  database: env.pg.database,
  synchronize: env.orm.synchronize,
  logging: env.orm.logging,
  // dropSchema: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entities",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
