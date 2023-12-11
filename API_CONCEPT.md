# Concept Rest IG API

## GET /posts
- list of posts
- return array of posts

### HTTP 200

```
[
    {
        post_uuid: 1,
        author: {
            uuid: 123,
            user_name:"adam_jedna",
            full_name: "Adam Jedna",
            profile_pic: {
                height: 100,
                width: 100,
                url:'https://img-storing-platform.com/...,
            },
            friendship_status: {
                is_current_user_following: true,
                ...
            },
            ...
        },
        post_description: 'Follow me',
        post_tags: ['api']
        post_media: [
            {
                url: 'https://img-storing-platform.com/...,
                height: 300,
                width: 100,
            },
            ...
        ],
        likes: {
            count: 13,
            has_current_user_liked: false,
            ...           
        },
        comments: [
            {
                author: "Oliver dva",
                author_uuid: "321",
                profile_pic: {
                    height: 100,
                    width: 100,
                    url:'https://img-storing-platform.com/...,
                },
                content: "I really like this post",
                likes: {
                    count: 13,
                    has_current_user_liked: false,
                    ...           
                },
                created_at: 123123123,
                ...
            },
            ...
        ],
        can_comment: true,
        can_save: true,
        can_share: true,
        location: "Bratislava, Slovakia",
        created_at: 12345678,
        ...
    },
    ...
]
```

## POST /posts/create

#### PAYLOAD 
```
{
    author_user_name: 'young_dev',
    image_data: // Base64 encoded image or image URL
    post_description: "New post",
    location: "Bratislava, Slovakia",
    tags: ['dev', 'api']
}
```
### HTTP 200
```
{
    "success": "POST_CREATED",
    "message": "Post was successfully created by {author_user_name}",
}
```
### HTTP 413 PAYLOAD TOO LARGE
```
{
    "error": "IMAGE_TOO_LARGE",
    "message": "Image you tried to upload is too large.",
    "max_allowed_size: "5Mb",
}
```


## GET /users/:user_name
- user detail

### HTTP 200
```
{
    uuid: 123,
    user_name:"adam_jedna",
    full_name: "Adam Jedna",
    profession: 'Developer',
    bio: 'I am Adam',
    outside_link: 'www.adam-developer.com',
    profile_pic: {
        height: 100,
        width: 100,
        url:'https://img-storing-platform.com/...,
    },
    friendship_status: {
        is_current_user_following: true,
        ...
    },
    follower_count: 1234,
    following_count: 4,
    posts_count: 12,
    ...
}
```

### HTTP 404 
```
{
    error: "USER_NOT_FOUND"
    message: "User {uuid} was not found."
}
```

## POST /users/:user_name/followers
- list of followers
- pagination can be triggered f.e. by scrolling
#### PAYLOAD 
```
{
    pageNumber: number,
    pageSize: number,
}
```
### HTTP 200
```
{
    followers_list: [
        {
            uuid: 12345,
            user_name:"ola_dev",
            full_name: "Ola Dev",
            profile_pic: {
                height: 100,
                width: 100,
                url:'https://img-storing-platform.com/...,
            },
            friendship_status: {
                is_current_user_following: false,
                ...
            },
            ...
        },
        ...
    ],
    pagination: {
        pageNumber: 1,
        pageSize: 20,
        totalPages: 10,
        totalItems: 198,
        nextPage: 2,
        previousPage: null,
    }
}
```

## GET /users/:user_name/following
- list of people user follows
## GET /users/:user_name/posts
- list of user's posts
## GET /users/:user_name/reels
## GET /users/:user_name/tagged

# AUTH

## POST /auth/register
- registration of new user
### PAYLOAD 
```
{
    user_name: string,
    email: string,
    password: string,
}
```
### HTTP 200 
```
{
    success: USER_REGISTERED,
    message: User {user_name} was successfully registered,
}
```
### HTTP 409 Conflict 
```
{
    error: "USER_NAME_MUST_BE_UNIQUE",
    message: "Username must be unique. User with this username already exists."
}
```

## POST /auth/login
- logging in of user
### PAYLOAD 
```
{
    user_name: string,
    password: string,
}
```
### HTTP 200
```
{
    success: "USER_LOGGED_IN",
    message: User was successfully authorized.
}
```
### HTTP 401 UNAUTHORIZED
```
{
  "error": "INVALID_CREDENTIALS",
  "message": "User entered invalid username or password."
}

```
## GET /auth/logout
- user logout
- get request with authToken in header based on which user token will be invalidated => user is logged out