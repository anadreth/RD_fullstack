import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
    id: Generated<number>
    username: string;
    password: string;
    created_at: ColumnType<Date, string | undefined, never>
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

export interface PostTable {
    id: Generated<number>
    user_id: number
    content: string
    image_filename: string,
    likes: number
    created_at: ColumnType<Date, string | undefined, never>
}

export type Post = Selectable<PostTable>
export type NewPost = Insertable<PostTable>
export type UpdatePost = Updateable<PostTable>

export interface Database {
    users: UserTable
    posts: PostTable
}

