import { Request, Response } from "express";
import { BaseDataBase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { PostDatabase } from "../data/PostDatabase";

export class PostController {

    async create(req: Request, res: Response) {
        try {
            if (!req.body.picture || !req.body.description || !req.body.type) {
                throw new Error("Required data is missing")
            }

            const token = req.headers.authorization as string;
            const userData = await new Authenticator().verify(token);
            await new PostDatabase().newPost(req.body.picture, req.body.description, req.body.type, userData.id, Date.now())

            res.sendStatus(200)

        } catch (err) {
            res.status(400).send({
                message: err.message,
            });
        } finally {
            await BaseDataBase.destroyConnection();
        }
    }

    async like(req: Request, res: Response) {
        try {
            if (!req.body.post) {
                throw new Error("Required data is missing")
            }

            const token = req.headers.authorization as string;
            const userData = await new Authenticator().verify(token);
            const verify = await new PostDatabase().verifyLiked(req.body.post, userData.id)
            console.log(verify)
            if (verify != 0) {
                throw new Error("User already liked this post")
            }
            await new PostDatabase().likePost(req.body.post, userData.id)

            res.sendStatus(200)

        } catch (err) {
            res.status(400).send({
                message: err.message,
            });
        } finally {
            await BaseDataBase.destroyConnection();
        }
    }

    async unLike(req: Request, res: Response) {
        try {
            if (!req.body.post) {
                throw new Error("Required data is missing")
            }

            const token = req.headers.authorization as string;
            const userData = await new Authenticator().verify(token);
            const verify = await new PostDatabase().verifyLiked(req.body.post, userData.id)
            if (verify == 0) {
                throw new Error("User not liked this post")
            }
            await new PostDatabase().unLikePost(req.body.post, userData.id)

            res.sendStatus(200)

        } catch (err) {
            res.status(400).send({
                message: err.message,
            });
        } finally {
            await BaseDataBase.destroyConnection();
        }
    }

    async comment(req: Request, res: Response) {
        try {
            const postId = req.query.postId as any
            const comment = req.body.comment as string
            const token = req.headers.authorization as string;
            const commentId = 0

            if (!comment) {
                throw new Error("Favor preencher o campo 'Comentário'.")
            }

            const userData = new Authenticator().verify(token);
            await new PostDatabase().postComment(userData.id, postId, commentId, comment)

            res.status(200).send("Comentario postado com sucesso!")

        } catch (err) {
            res.status(400).send(err.message)
        } finally {
            await BaseDataBase.destroyConnection();
        }
    }
}