import { DataSource } from "typeorm"
import { MatchEntity } from "../entities/match.entity"
import { TicketItemEntity } from "../entities/ticket-item.entity"
import { TicketEntity } from "../entities/ticket.entity"
import { TransactionEntity } from "../entities/transaction.entity"
import { UserEntity } from "../entities/user.entity"
import { env } from "../utils/wrappers/env-wrapper"


const dataSource = new DataSource({
    type: "postgres",
    host: env.pg.host,
    port: env.pg.port,
    username: env.pg.username,
    password: env.pg.password,
    database: env.pg.database,
    synchronize: env.orm.synchronize,
    logging: env.orm.logging,
    entities: [UserEntity, TransactionEntity, TicketEntity, TicketItemEntity, MatchEntity],
    installExtensions: true,
})

export default dataSource;
