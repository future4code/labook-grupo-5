import { BaseDataBase } from "../data/BaseDatabase"

export class FeedController extends BaseDataBase {
  public async takeFriendshipById(id: string): Promise<any> {
    const result = await super.getConnection().raw(`
    SELECT
			     *
           FROM labook5_posts
           LEFT JOIN labook5_friendship ON labook5_posts.user_creator = labook5_friendship.user_b_id
           WHERE
           labook5_friendship.user_a_id = '${id}';
    `)

    console.log(result[0])
    return result[0]
  }
}