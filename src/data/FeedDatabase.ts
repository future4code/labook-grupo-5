import { Request, Response } from "express";
import { BaseDataBase } from "../data/BaseDatabase";
import { FeedController } from "../controller/FeedController";

export const FeedDatabase = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id as string
    const auth = req.headers.Authorization

    const feedController = await new FeedController().takeFriendshipById(userId)

    res.status(200).send(feedController)

  } catch (err) {
    res.status(400).send({ err: err })
  } finally {
    await BaseDataBase.destroyConnection();
  }
}
