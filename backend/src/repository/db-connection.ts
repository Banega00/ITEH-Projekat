import { DataSource } from "typeorm"
import { TransactionEntity } from "../entities/transaction.entity"
import { UserEntity } from "../entities/user.entity"
import { env } from "../utils/wrappers/env-wrapper"


export const dataSource = new DataSource({
    type: "postgres",
    host: env.pg.host,
    port: env.pg.port,
    username: env.pg.username,
    password: env.pg.password,
    database: env.pg.database,
    synchronize: env.orm.synchronize,
    logging: env.orm.logging,
    entities: [UserEntity, TransactionEntity],
    installExtensions: true
})

export const setupConnection = async () => await dataSource.initialize()
