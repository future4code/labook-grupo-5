import {Request, Response} from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDataBase } from "../data/BaseDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

export class UserController{
    
    async signup(req: Request, res:Response){
        try{
            if(!req.body.name || !req.body.email || !req.body.password){
                throw new Error("Invalid name, email or password")
            }

            const userData = {
                name:req.body.name,
                email: req.body.email,
                password: req.body.password
            }

            const idGenerator = new IdGenerator();
            const id = idGenerator.generateId();

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(userData.password)

            const userBusiness = new UserBusiness();
            await userBusiness.signup(
                id,
                userData.name,
                userData.email,
                hashPassword
            )

            const authenticator = new Authenticator();        
            const accessToken = authenticator.generateToken({
                id
            }, process.env.ACCESS_TOKEN_EXPIRES_IN);

            res.status(200).send({
                access_token: accessToken
            })

        }catch(err){
            res.status(400).send({err: err})
        }finally{
            await BaseDataBase.destroyConnection();
        }
    }
    
}