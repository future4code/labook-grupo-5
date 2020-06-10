import { BaseDataBase } from "./BaseDatabase";
import { PostType, Post } from "../model/Post";

export class PostDatabase extends BaseDataBase {

    public async newPost(picture: string, description: string, type: string, user: string, date: number) {
        return await super.getConnection().raw(`
        INSERT INTO ${BaseDataBase.POST_TABLE_NAME}
        (user_creator, picture, description, creation_date, type)
        VALUES
        ("${user}","${picture}","${description}",${date},"${type}")
        `);
    }

    public async verifyLiked(post:number, user: string): Promise<number> {
        const result = await super.getConnection().raw(`
        SELECT COUNT(*) as cont FROM ${BaseDataBase.LIKES_TABLE_NAME}
        WHERE user_id = "${user}" AND post_id = ${post}
            `)
        return result[0][0].cont;
    }

    public async likePost(post:number, user: string): Promise<void> {
        await super.getConnection().raw(`
        INSERT INTO ${BaseDataBase.LIKES_TABLE_NAME}
        (user_id, post_id) VALUES ("${user}",${post} )
            `)
    }

    public async unLikePost(post:number, user: string): Promise<void> {
        await super.getConnection().raw(`
        DELETE FROM ${BaseDataBase.LIKES_TABLE_NAME}
        WHERE user_id = "${user}" AND post_id = ${post}
            `)
    }

    public async postComment(userId: string, postId: any, commentId: number, comment: string): Promise<any> {
        await super.getConnection().raw(`
        INSERT INTO ${BaseDataBase.COMMENTS_TABLE_NAME}
        (creator_id, post_id, comment_id, comment) 
        VALUES ("${userId}", ${postId}, "${commentId}", "${comment}");

        `)
    }

    public async getPostsByType(postType: PostType): Promise<Post[]>{
        const result = await super.getConnection()
        .select("*")
        .from(BaseDataBase.POST_TABLE_NAME)
        .where({type: postType})

        const postsArray: Array<Post> = [];

        for(let post of result){
            const newPost = new Post(post.id,post.user_creator, post.picture, post.description, post.creation_date, post.type)
            postsArray.push(newPost)
        }

        return postsArray;
    }
}