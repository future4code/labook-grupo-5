import { BaseDataBase } from "./BaseDatabase";

export class UserDatabase extends BaseDataBase{
    tableName: string = "labook5_users";

    public async signup(id:string ,name:string, email: string, password:string){
        return await super.getConnection().raw(`
            INSERT INTO ${this.tableName} (user_id, name, email, password)
            VALUES('${id}', '${name}', '${email}', '${password}')
        `);
    }



}