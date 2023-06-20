import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
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
}