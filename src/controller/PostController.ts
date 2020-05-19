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
            res.status(400).send({ err: err })
        } finally {
            await BaseDataBase.destroyConnection();
        }
    }

}