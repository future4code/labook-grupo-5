import { Request, Response } from 'express'
import { BaseDataBase } from '../data/BaseDatabase'
import { FriendshipDatabase } from '../data/FriendshipDatabase'
import { FriendshipBusiness } from '../business/FriendshipBussiness'
import { Authenticator } from '../services/Authenticator'


export class FriendshipController {
    async addFriend(req: Request, res: Response) {

        try {
            const followerToken = req.headers.authorization as string
            const followedId = req.body.followedId

            const authenticator = new Authenticator()
            const followerId = authenticator.verify(followerToken)

            if (!followedId || !followerToken || followedId === "") {
                throw new Error("Dados de usuário inválidos")
            }

            const friendshipBusiness = new FriendshipBusiness()
            friendshipBusiness.follow(followerId.id, followedId)
                .then((result) => {
                    res.status(200).send({ message: "PARABÉNS, você tem um novo amigo!", result })
                    BaseDataBase.destroyConnection()
                }).catch((err) => { res.status(400).send({ message: err.message }) })

        } catch (err) {
            res.status(400).send({ message: err.message })
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
            await new FriendshipBusiness().unfollow(followerId.id, unfollowedId)

            res.status(200).send({ message: "Amizade desfeita!" })

        } catch (err) {
            res.status(400).send({ message: err.message })
        }

        finally {
            await BaseDataBase.destroyConnection()
        }
    }
}