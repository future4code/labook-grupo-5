import { BaseDataBase } from "./BaseDatabase";

export class UserDatabase extends BaseDataBase{
    public async signup(id: string, name: string, email: string, password: string) {
        return await super.getConnection().raw(`
            INSERT INTO ${BaseDataBase.USER_TABLE_NAME} (user_id, name, email, password)
            VALUES('${id}', '${name}', '${email}', '${password}')
        `);

    };

    public async login(email: string): Promise <any> {
        const user = await super.getConnection().raw(`
            SELECT * FROM ${BaseDataBase.USER_TABLE_NAME} WHERE email = '${email}'
        `)       

        return user[0][0]        
    }
}