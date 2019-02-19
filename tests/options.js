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

export {
    getProfile,
    login,
    getUsers,
    createUser
}