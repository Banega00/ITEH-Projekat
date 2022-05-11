//dotenv - API for reading .env files
import { config } from "dotenv";
config();

import { env } from './src/utils/wrappers/env-wrapper';
import app from "./src/app";
import dataSource from "./src/repository/db-connection";
import { updateFinishedMatches } from "./src/utils/update-ticket";
import { UserEntity } from "./src/entities/user.entity";



(async function main(): Promise<void> {

    try {
        const PORT = env.port;

        // Connecting with database
        console.log(dataSource);

        await dataSource.initialize();

        await dataSource.runMigrations();
        console.log(dataSource.migrations)
        console.log(`Connected to database successfully! 💾`)

        //Starting server
        app.listen(PORT);
        console.log(`Server is listening on port ${PORT} 🔥🔥🔥`)

        // updateFinishedMatches()
        // setInterval(updateFinishedMatches,10*60*1000)//every 10 mins
    } catch (error) {
        console.log(error);
        process.exit(-1);
    }

})();
