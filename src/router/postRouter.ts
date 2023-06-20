import express from 'express'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostController } from '../controller/PostController'
import { PostBusiness } from '../business/PostBusiness'
import { PostDatabase } from '../database/PostDatabase'

export const postRouter = express.Router()

const postController = new PostController(
  new PostBusiness(
    new PostDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

postRouter.post("/", postController.createPost)
postRouter.get("/", postController.getPosts)
////playlistRouter.put("/:id", playlistController.editPlaylist)
//playlistRouter.delete("/:id", playlistController.deletePlaylist)

//playlistRouter.put("/:id/like", playlistController.likeOrDislikePlaylist)