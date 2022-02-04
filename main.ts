//dotenv - API for reading .env files
import { config } from "dotenv";
config();

import { env } from './src/utils/wrappers/env-wrapper';
import app from "./src/app";



(async function main(): Promise<void> {

    try {
        const PORT = env.port;
        
        //Connecting with database
        //await createConnection();

        //Starting server
        app.listen(PORT);
        console.log(`Server is listening on port ${PORT} 🔥🔥🔥`)
    } catch (error) {
        console.log(error);
        process.exit(-1);
    }

})();
