import { BaseDataBase } from "../data/BaseDatabase";

export class FeedDatabase extends BaseDataBase {

  public async showFeed(id: string): Promise<any> {
    const userAResult = await super.getConnection().raw(`
    SELECT
          user_creator,
          picture,
          description,
          creation_date,
          type
          FROM labook5_posts
          LEFT JOIN labook5_friendship ON labook5_posts.user_creator = labook5_friendship.user_b_id
          WHERE
          labook5_friendship.user_a_id = '${id}'
          ;
    `)

    const userBResult = await super.getConnection().raw(`
    SELECT
          user_creator,
          picture,
          description,
          creation_date,
          type
          FROM labook5_posts
          LEFT JOIN labook5_friendship ON labook5_posts.user_creator = labook5_friendship.user_a_id
          WHERE
          labook5_friendship.user_b_id = '${id}'
          ;
    `)
    const result = userAResult[0].concat(userBResult[0])

    return result.sort(function (a: any, b: any) {
      return a.creation_date > b.creation_date ? -1 : a.creation_date < b.creation_date ? 1 : 0
    })
  }

  async filterType(id: string, type: string) {
    const userAResult = await super.getConnection().raw(`
    SELECT
          user_creator,
          picture,
          description,
          creation_date,
          type
          FROM labook5_posts
          LEFT JOIN labook5_friendship ON labook5_posts.user_creator = labook5_friendship.user_b_id
          WHERE
          labook5_friendship.user_a_id = '${id}'
          AND
          labook5_posts.type = '${type}'
          ;
    `)    
    const userBResult = await super.getConnection().raw(`
    SELECT
          user_creator,
          picture,
          description,
          creation_date,
          type
          FROM labook5_posts
          LEFT JOIN labook5_friendship ON labook5_posts.user_creator = labook5_friendship.user_a_id
          WHERE
          labook5_friendship.user_b_id = '${id}' 
          AND
          labook5_posts.type = '${type}'
          ;
    `)
    const result = userAResult[0].concat(userBResult[0])

    return result.sort(function (a: any, b: any) {
      return a.creation_date > b.creation_date ? -1 : a.creation_date < b.creation_date ? 1 : 0
    })
  }
}
