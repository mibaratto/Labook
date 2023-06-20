import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { ForbiddenError } from "../erros/ForbiddenError";
import { NotFoundError } from "../erros/NotFoundError";
import { UnauthorizedError } from "../erros/UnauthorizedError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO>=> {
        const { content, token} = input

        const playload = this.tokenManager.getPayload(token)

        if(!playload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()
        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            playload.id,
            playload.name
        )
        const postDB = post.toDBModel()
        await this.postDatabase.insertPost(postDB)

        const output: CreatePostOutputDTO = undefined
        return output
    }

    public getPosts = async (
        input: GetPostsInputDTO
      ): Promise<GetPostsOutputDTO> => {
        const { token } = input
    
        const payload = this.tokenManager.getPayload(token)
    
        if (!payload) {
          throw new UnauthorizedError()
        }
    
        const postsDBwithCreatorName =
          await this.postDatabase.getPostsWithCreatorName()
        
        const posts = postsDBwithCreatorName
          .map((postDBwithCreatorName) => {
            const post = new Post(
              postDBwithCreatorName.id,
              postDBwithCreatorName.content,
              postDBwithCreatorName.likes,
              postDBwithCreatorName.dislikes,
              postDBwithCreatorName.created_at,
              postDBwithCreatorName.updated_at,
              postDBwithCreatorName.creator_id,
              postDBwithCreatorName.creator_name
            )
    
            return post.toBusinessModel()
        })
    
        const output: GetPostsOutputDTO = posts
    
        return output
      }

      public editPost = async (
        input: EditPostInputDTO
      ): Promise<EditPostOutputDTO> => {
        const { content, token, idToEdit } = input
    
        const payload = this.tokenManager.getPayload(token)
    
        if (!payload) {
          throw new UnauthorizedError()
        }
    
        const postDB = await this.postDatabase
          .findPostById(idToEdit)
    
        if (!postDB) {
          throw new NotFoundError("playlist with this id not found")
        }
    
        if (payload.id !== postDB.creator_id) {
          throw new ForbiddenError("only the creator of the playlist can edit it")
        }
    
        const post = new Post(
          postDB.id,
          postDB.content,
          postDB.likes,
          postDB.dislikes,
          postDB.created_at,
          postDB.updated_at,
          postDB.creator_id,
          payload.name
        )
    
        post.setContent(content)
    
        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)
    
        const output: EditPostOutputDTO = undefined
    
        return output
      }
}