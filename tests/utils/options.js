import {
    gql
} from 'apollo-boost'

const createUser = gql `
    mutation($data: CreateUserInput!) {
        createUser(
            data: $data
        ){
            token,
            user {
                id
                }
            }
        }
    `
const getUsers = gql `
    query {
        users {
            id,
            name,
            email
        }
    }
`
const login = gql `
    mutation($data: LoginUserInput!) {
        loginUser( data: $data){
            token
        }
    }
`
const getProfile = gql `
    query {
        me {
            name,
            id,
            email
        }
    }
`
const getPosts = gql `
    query {
        posts {
            title,
            body,
            published,
            id
        }
    }
`
const fetchPosts = gql `
    query {
        myPosts {
            title,
            body,
            id,
            published
        }
    }    
`

const updatePost = gql `
mutation($data: UpdatePostInput!, $id: ID!) {
    updatePost(id: $id, data: $data ) {
        title,
        body,
        published
        }
    }
`

const createPost = gql `
    mutation($data: CreatePostInput!) {
        createPost(data: $data){
            id
            title
            body
            published
        }
    }
`

const deletePostMutation = gql `
    mutation($id: ID!) {
        deletePost(id: $id) {
            title
            published
            body
            id
        }
    }
`
const deleteComment = gql `
    mutation($id: ID!) {
        deleteComment(id: $id) {
            text,
            id
        }
    }
`

export {
    getProfile,
    login,
    getUsers,
    createUser,
    getPosts,
    fetchPosts,
    updatePost,
    createPost,
    deletePostMutation,
    deleteComment
}