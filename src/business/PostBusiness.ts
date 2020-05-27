import { PostType, Post } from "../model/Post";
import { PostDatabase } from "../data/PostDatabase";

export class PostBusiness {

    getPostsByType(postType: PostType): Promise<Post[]> {
        return new PostDatabase().getPostsByType(postType);

    }

    static mapStringToPostType(type: string): PostType {
        switch(type){
            case 'normal':
                return PostType.NORMAL;
            case 'evento':
                return PostType.EVENTO;
            default:
                throw new Error('Tipo Inválido');
        }
    }
}