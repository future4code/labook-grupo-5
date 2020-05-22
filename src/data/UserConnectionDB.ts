import { BaseDataBase } from './BaseDatabase'

export class UserConnectionDB extends BaseDataBase {
    tableName: string = "labook5_friendship"

    public async follow(followerId: string, followedId: string): Promise<void> {
        const result = await this.getConnection()
            .raw(`SELECT friendship_id FROM ${this.tableName} 
            WHERE (user_a_id = "${followerId}" AND user_b_id = "${followedId}")
            OR (user_a_id = "${followedId}" AND user_b_id = "${followerId}")
            `)

        if (result[0][0]) {
            throw new Error("Amizade já existe.")
        } else {
            await this.getConnection()
                .insert({
                    user_a_id: followerId,
                    user_b_id: followedId
                })
                .into(this.tableName)
        }
    }

    public async unfollow(followerId: string, followedId: string): Promise<void> {
        const result = await this.getConnection()
            .raw(`SELECT friendship_id FROM ${this.tableName} 
            WHERE (user_a_id = "${followerId}" AND user_b_id = "${followedId}")
            OR (user_a_id = "${followedId}" AND user_b_id = "${followerId}")
            `)

        if (!result[0][0]) {
            throw new Error("Não é possível desfazer uma amizade que não existe.")
        } else {
            await this.getConnection()
                .delete()
                .from(this.tableName)
                .where({ user_b_id: followedId, user_a_id: followerId })
                .orWhere({ user_a_id: followerId, user_b_id: followedId })
                .into(this.tableName)

        }
    }
}