import { DataSource } from "typeorm";
import { Membership } from "../entity/membership.entity";
import { MembershipPeriod } from "../entity/membership-period.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.POSTGRES_USER || "membership_user",
    password: process.env.POSTGRES_PASSWORD || "membership_password",
    database: process.env.POSTGRES_DB || "membership_db",
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
    entities: [Membership, MembershipPeriod],
    migrations: ["src/modern/migration/*.ts"],
    subscribers: [],
}); 