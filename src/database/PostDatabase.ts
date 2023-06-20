import { PostDB, PostDBWithCreatorName } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = 'posts'
    public static TABLE_LIKES_DISLIKES = 'likes_dislikes'

    public insertPost = async (
        postDB: PostDB
    ): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POST)
        .insert(postDB)
    }

    public getPostsWithCreatorName =
    async (): Promise<PostDBWithCreatorName[]> => {

    const result = await BaseDatabase
      .connection(PostDatabase.TABLE_POST)
      .select(
        `${PostDatabase.TABLE_POST}.id`,
        `${PostDatabase.TABLE_POST}.creator_id`,
        `${PostDatabase.TABLE_POST}.content`,
        `${PostDatabase.TABLE_POST}.likes`,
        `${PostDatabase.TABLE_POST}.dislikes`,
        `${PostDatabase.TABLE_POST}.created_at`,
        `${PostDatabase.TABLE_POST}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POST}.creator_id`, 
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
    
    return result as PostDBWithCreatorName[]
  }

  
  public findPostById = async (
    id: string
  ): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POST)
      .select()
      .where({ id })

    return result as PostDB | undefined
  }


  public updatePost = async (
    postDB: PostDB
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POST)
      .update(postDB)
      .where({ id: postDB.id })
  }


  public deletePostById = async (
    id: string
  ): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POST)
      .delete()
      .where({ id })
  }

}
