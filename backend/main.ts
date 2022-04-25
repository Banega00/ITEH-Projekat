//dotenv - API for reading .env files
import { config } from "dotenv";
config();

import { env } from './src/utils/wrappers/env-wrapper';
import app from "./src/app";
import { dataSource, setupConnection } from "./src/repository/db-connection";
import { updateFinishedMatches } from "./src/utils/update-ticket";



(async function main(): Promise<void> {

    try {
        const PORT = env.port;

        // Connecting with database
        console.log(dataSource);

        await setupConnection();
        console.log(`Connected to database successfully! 💾`)
        //Starting server
        app.listen(PORT);
        console.log(`Server is listening on port ${PORT} 🔥🔥🔥`)

        updateFinishedMatches()

    } catch (error) {
        console.log(error);
        process.exit(-1);
    }

})();
