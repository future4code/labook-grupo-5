import {Request, Response} from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseDataBase } from "../data/BaseDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { RefreshTokenDatabase } from "../data/RefreshTokenDatabase";
export class UserController{
    
    async signup(req: Request, res:Response){
        try{
            if(!req.body.name || !req.body.email || !req.body.password){
                throw new Error("Invalid name, email or password")
            }

            const userData = {
                name:req.body.name,
                email: req.body.email,
                password: req.body.password,
                device: req.body.device
            }

            const id = new IdGenerator().generateId();          

            const hashManager = new HashManager();
            const hashPassword = await hashManager.hash(userData.password)

            const userBusiness = new UserBusiness();
            await userBusiness.signup(
                id,
                userData.name,
                userData.email,
                hashPassword
            )

            const accessToken = new Authenticator().generateToken({
                id
            }, process.env.ACCESS_TOKEN_EXPIRES_IN);

            const refreshToken = new Authenticator().generateToken({
                id,
                device: userData.device
            }, process.env.REFRESH_TOKEN_EXPIRES_IN);
    
            const refreshTokenDatabase = new RefreshTokenDatabase();
            await refreshTokenDatabase.create(
                refreshToken,
                userData.device,
                true,
                id
            );  

            res.status(200).send({
                access_token: accessToken,
                refresh_token: refreshToken
            })

        }catch(err){
            res.status(400).send({err: err.message})
        }finally{
            await BaseDataBase.destroyConnection();
        }
    };
    
    async login(req: Request, res: Response) {
        try{
            if(!req.body.email || !req.body.password){
                throw new Error("Invalid email or password")
            }

            const userData = {                
                email: req.body.email,
                password: req.body.password,
                device: req.body.device
            }

            const userDatabase = new UserDatabase();
            const user = await userDatabase.login(userData.email)

            if(!user){
                throw new Error("User not found")
            }

            const hashManager = new HashManager();
            const comparePassword = await hashManager.compare(userData.password, user.password)
            if (!comparePassword) {
                throw new Error("Invalid Password")
              }

            const accessToken = new Authenticator().generateToken({
                id: user.user_id
            }, process.env.ACCESS_TOKEN_EXPIRES_IN )

            const refreshToken = new Authenticator().generateToken({
                id: user.user_id,
                device: userData.device
              }, process.env.REFRESH_TOKEN_EXPIRES_IN );
          
              const refreshTokenDatabase = new RefreshTokenDatabase();
          
              const refreshTokenFromDatabase = await refreshTokenDatabase.getByUserIdAndDevice(
                user.user_id,
                userData.device
              )
          
              if(refreshTokenFromDatabase !== undefined) {
                await refreshTokenDatabase.delete(refreshTokenFromDatabase.refreshToken)
              }
          
              await refreshTokenDatabase.create(
                refreshToken,
                userData.device,
                true,
                user.user_id
              )

            res.status(200).send({
                access_token: accessToken,
                refresh_token: refreshToken
            })
            
        }catch(err){
            res.status(400).send({err: err.message})
        }finally{
            await BaseDataBase.destroyConnection();
        }
    }

    async refreshToken (req: Request, res: Response) {
        try{
            const refreshToken = req.body.refreshToken;
            const device = req.body.device;

            const refreshTokenData = new Authenticator().verify(refreshToken);
            console.log(refreshTokenData)

            if(refreshTokenData.device !== device){
                throw new Error("Wrong Device")
            }

            const accessToken = new Authenticator().generateToken({
                id: refreshTokenData.id
            }, process.env.ACCESS_TOKEN_EXPIRES_IN)

            res.status(200).send({
                accessToken
            })
        }catch(err){
            res.status(400).send({err: err.message})
        }finally{
            await BaseDataBase.destroyConnection();
        }
    }
}