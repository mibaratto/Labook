import { ZodError } from "zod";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../erros/BaseError";
import { CreatePostSchema } from "../dtos/post/createPost.dto";
import { Request, Response } from "express";
import { GetPostsSchema } from "../dtos/post/getPosts.dto";
import { EditPostSchema } from "../dtos/post/editPost.dto";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            })

            const output = await this.postBusiness.createPost(input)
            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }

        }
    }

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = GetPostsSchema.parse({
                token: req.headers.authorization
            })
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input = EditPostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content,
                idToEdit: req.params.id
            })
            const output = await this.postBusiness.editPost(input)
            res.status(200).send(output)
            
        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("unexpected error")
            }
        }
    }
}