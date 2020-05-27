export class Post {
    constructor(
        private id: string,
        private userCreator: string,
        private picture: string,
        private description: string,
        private creationDate: number,
        private type: PostType,
    ){}
}

export enum PostType {
    NORMAL = 'normal',
    EVENTO = 'evento'
}