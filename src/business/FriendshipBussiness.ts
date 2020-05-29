import { FriendshipDatabase } from '../data/FriendshipDatabase'

export class FriendshipBusiness {

    public async follow(followerId: string, followedId: string) {

        const friendshipDatabase = new FriendshipDatabase()
        const result = await friendshipDatabase.follow(followerId, followedId)
        return result
    }

    public async unfollow(followerId: string, userToUnfollowId: string) {
        return await new FriendshipDatabase().unfollow(followerId, userToUnfollowId)
    }
}