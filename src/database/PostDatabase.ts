import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

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

    public getPosts = async (): Promise<PostDB[]> => {
        const postsDB = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select()

        return postsDB
    }

}