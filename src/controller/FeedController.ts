import { BaseDataBase } from "../data/BaseDatabase"
import { Request, Response } from 'express'
import { FeedDatabase } from "../data/FeedDatabase"
import { Authenticator } from "../services/Authenticator"

export class FeedController extends BaseDataBase {

  async showFeed(req: Request, res: Response) {
    try {
      const token = req.headers.authorization as string
      const userData = await new Authenticator().verify(token);
      
      if (!userData) {
        throw new Error("Falha na autenticação.")
      }
      const feedDatabase = await new FeedDatabase().showFeed(userData.id)

      res.status(200).send(feedDatabase)

    } catch (err) {
      res.status(400).send( err.message )
    } finally {
      await BaseDataBase.destroyConnection();
    }
  }

  async showFeedByType(req: Request, res: Response) {
    try {
      if (!req.query.id) {
        throw new Error("Favor preencher o campo 'id'.")
      }
      if (!req.query.type) {
        throw new Error("Favor preencher o campo 'tipo'.")        
      }
      const token = req.headers.authorization as string
      const userData = await new Authenticator().verify(token);
      const postType = req.query.type as string

      if (!userData) {
        throw new Error("Falha na autenticação.")
      }

      if(postType === 'normal' ) {
      } else if (postType === 'evento') {
      } else {
        throw new Error("Apenas eventos do tipo 'evento' ou 'normal' são permitidos.")
      }
      
      const feedDatabase = await new FeedDatabase().filterType(userData.id, postType)

      res.status(200).send(feedDatabase)
      
    } catch (err) {
      res.status(400).send( err.message )
    } finally {
      await BaseDataBase.destroyConnection();
    }
  }

}