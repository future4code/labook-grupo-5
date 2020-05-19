import express from "express";
import { PostController } from "../controller/PostController";

export const postsRouter = express.Router();

postsRouter.post("/new", new PostController().create);

