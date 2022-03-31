class EnvWrapper {
    public port = this.getProperty("port");

    public pg = {
        host: this.getProperty("pg_host"),
        port: this.toNumber(this.getProperty("pg_port")),
        username: this.getProperty("pg_username"),
        password: this.getProperty("pg_password"),
        database: this.getProperty("pg_db_name"),
    }
 
    public orm = {
        synchronize: this.toBoolean(this.getProperty("orm_synchronize")),
        logging: this.toBoolean(this.getProperty("orm_logging"))
    }

    //Reads property from env file
    private getProperty(property: string): string {
        return process.env[property.toUpperCase()] || process.env[property.toLowerCase()] || "";
    }

    private toNumber(value: string): number {
        return +value;
    }
 
    private toBoolean(value: string): boolean {
        return value.toLowerCase() === "true";
    }
}

export const env = new EnvWrapper();
