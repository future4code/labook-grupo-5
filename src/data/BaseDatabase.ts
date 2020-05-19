import dotenv from "dotenv";
import knex from "knex";
import Knex from "knex";

dotenv.config();

export abstract class BaseDataBase {
    // abstract tableName: string;
    private static KNEX_CONNECTION: Knex | null = null;
    protected static COMMENTS_TABLE_NAME = "labook5_comments";
    protected static FRIENDSHIP_TABLE_NAME = "labook5_friendship";
    protected static REFRESHTOKEN_TABLE_NAME = "labook5_refreshtoken";
    protected static POST_TABLE_NAME = "labook5_posts";
    protected static USER_TABLE_NAME = "labook5_users";

    protected getConnection() {
        if (BaseDataBase.KNEX_CONNECTION === null) {
            BaseDataBase.KNEX_CONNECTION = knex({
                client: "mysql",
                connection: {
                    host: process.env.DB_HOST,
                    port: 3306,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_DATABASE_NAME,
                },
            });
        }
        return BaseDataBase.KNEX_CONNECTION
    }

    public static async destroyConnection() {
        if (BaseDataBase.KNEX_CONNECTION !== null) {
            await BaseDataBase.KNEX_CONNECTION.destroy()
        }
        BaseDataBase.KNEX_CONNECTION = null
    }
}