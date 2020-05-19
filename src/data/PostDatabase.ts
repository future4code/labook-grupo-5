import { BaseDataBase } from "./BaseDatabase";

export class PostDatabase extends BaseDataBase {

    public async newPost(picture: string, description: string, type: string, user: string, date: number) {
        return await super.getConnection().raw(`
        INSERT INTO ${BaseDataBase.POST_TABLE_NAME}
        (user_creator, picture, description, creation_date, type)
        VALUES
        ("${user}","${picture}","${description}",${date},"${type}")
        `);
    }
}

