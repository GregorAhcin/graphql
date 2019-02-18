import "@babel/polyfill/noConflict"
import "cross-fetch/polyfill"
import {
    gql
} from 'apollo-boost'
import prisma from '../src/prisma'

import seedDatabase, {
    userOne
} from './utils/seedDatabase'
import getClient from './utils/getClient'


const client = getClient()

beforeEach(seedDatabase)

test('Should create new User in database', async () => {
    const createUser = gql `
            mutation {
                createUser(
                     data: {
                    name: "Gregor",
                    email: "gregor@test.si",
                    password: "gregor"
                }
                ){
                    token,
                    user {
                        id
                    }
                }
            }
        `

    const response = await client.mutate({
        mutation: createUser
    })

    const userExist = await prisma.exists.User({
        id: response.data.createUser.user.id
    })


    expect(userExist).toBe(true)
})

test('Should return a user data', async () => {
    const getUsers = gql `
            query {
                users {
                    id,
                    name,
                    email
                }
            }
        `

    const response = await client.query({
        query: getUsers
    })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe("Tatjana")
})


test('Should reject wrong credentials', async () => {
    const login = gql `
        mutation {
            loginUser( data: {
                email: "tatjana@test.si",
                password: "tatjanaaaaa"
            }){
                token
            }
        }
    `

    await expect(client.mutate({
        mutation: login
    })).rejects.toThrow()
})

test('Should reject creating User with to short password', async () => {
    const createUser = gql `
        mutation { 
            createUser( data: {
                name: "Gregor",
                email: "gregor@test.si",
                password: "tat"
            }){
                token
        }
        }
    `

    await expect(client.mutate({
        mutation: createUser
    })).rejects.toThrow()

})

test('Should return authenticated User', async () => {
    const client = getClient(userOne.token)
    const getProfile = gql `
        query {
            me {
                name,
                id,
                email
            }
        }
    `
    const {
        data
    } = await client.query({
        query: getProfile
    })

    expect(data.me.id).toBe(userOne.output.id)
    expect(data.me.name).toBe(userOne.input.name)
    expect(data.me.email).toBe(userOne.input.email)
})