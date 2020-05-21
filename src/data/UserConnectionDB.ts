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
    
    public async unfollow(followedId: string, followerId: string): Promise<void> {
        await this.getConnection()
        .delete()
        .from(this.tableName)
        .where({user_b_id:followedId})
        .andWhere({user_a_id: followerId})
    }
}