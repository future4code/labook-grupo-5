import { Request, Response } from 'express'
import { BaseDataBase } from '../data/BaseDatabase'
import { UserConnectionDB } from '../data/UserConnectionDB'
import { Authenticator } from '../services/Authenticator'


export class FriendshipController {
    async addFriend(req: Request, res: Response) {

        try {
            const followerToken = req.headers.authorization as string
            const followedId = req.body.followedId

            const userConnectionDB = new UserConnectionDB()

            if (!followedId || !followerToken || followedId === "") {
                throw new Error("Dados de usuário inválidos")
            }

            const authenticator = new Authenticator()
            const followerId = authenticator.verify(followerToken)

            await userConnectionDB.follow(followerId.id, followedId)

            res.status(200).send({ message: "PARABÉNS, você tem um novo amigo!" })

        } catch (err) {
            res.status(400).send({ message: err.message })
        }

        finally {
            await BaseDataBase.destroyConnection()
        }
    }

    async deleteFriend(req: Request, res: Response) {
        try {
            const followerToken = req.headers.authorization as string
            const unfollowedId = req.body.userToUnfollowId

            if (!unfollowedId || !followerToken || unfollowedId === "") {
                throw new Error("Dados inválidos")
            }

            const followerId = new Authenticator().verify(followerToken)
            await new UserConnectionDB().unfollow(followerId.id, unfollowedId)

            res.status(200).send({ message: "Amizade desfeita!" })

        } catch (err) {
            res.status(400).send({ message: err.message })
        }

        finally {
            await BaseDataBase.destroyConnection()
        }
    }
}