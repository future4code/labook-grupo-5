import { BaseDataBase } from "../data/BaseDatabase"
import { Request, Response } from 'express'
import { FeedDatabase } from "../data/FeedDatabase"
import { Authenticator } from "../services/Authenticator"

export class FeedController extends BaseDataBase {

  async showFeed(req: Request, res: Response) {
    try {
      const userId = req.query.id as string
      const token = req.headers.authorization as string
      const userData = await new Authenticator().verify(token);
      
      if (!userData) {
        throw new Error("Falha na autenticação.")
      }
      const feedDatabase = await new FeedDatabase().showFeed(userId)

      res.status(200).send(feedDatabase)

    } catch (err) {
      res.status(400).send( err.message )
    } finally {
      await BaseDataBase.destroyConnection();
    }
  }
}