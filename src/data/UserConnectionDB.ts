import { BaseDataBase } from './BaseDatabase'

export class UserConnectionDB extends BaseDataBase {
     tableName: string = "labook5_friendship"

    public async follow(followerId:string, followedId: string): Promise<void> {
        await this.getConnection()
        .insert({
            user_a_id: followerId,
            user_b_id:followedId
        })
        .into(this.tableName)
    }
    
}