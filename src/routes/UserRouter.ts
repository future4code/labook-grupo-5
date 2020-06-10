import express from "express";
import { UserController } from "../controller/UserController";
import { FriendshipController } from "../controller/FriendshipController"
import { FeedController } from "../controller/FeedController";

export const userRouter = express.Router();

userRouter.post("/signup", new UserController().signup);
userRouter.post("/login", new UserController().login);
userRouter.post("/refresh/token", new UserController().refreshToken);
userRouter.get("/feed", new FeedController().showFeed);
userRouter.get("/feed/type", new FeedController().showFeedByType);


// Follow routes
userRouter.post("/friendship", new FriendshipController().addFriend)
userRouter.delete("/undofriendship", new FriendshipController().deleteFriend)
