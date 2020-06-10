import express from "express";
import { PostController } from "../controller/PostController";

export const postsRouter = express.Router();

postsRouter.post("/new", new PostController().create);
postsRouter.post("/comment", new PostController().comment);
postsRouter.post("/like", new PostController().like);
postsRouter.put("/unlike", new PostController().unLike);

postsRouter.get("/", new PostController().getPostsByType);