import '@babel/polyfill/noConflict'
import 'cross-fetch/polyfill'

import {
    gql
} from 'apollo-boost'
import prisma from '../src/prisma'

import seedDatabase, {
    userOne,
    postOne,
    postTwo
} from './utils/seedDatabase'
import getClient from './utils/getClient'

const client = getClient()

beforeEach(seedDatabase)

test('Should return published post', async () => {
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
    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(1)
    expect(response.data.posts[0].published).toBe(true)
    expect(response.data.posts[0].title).toBe("Published post")
})

test('Should return authenticated User posts', async () => {
    const client = getClient(userOne.token)

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

    const {
        data
    } = await client.query({
        query: fetchPosts
    })

    expect(data.myPosts.length).toBe(2)

})

test('Should update authenticated User post', async () => {
    const client = getClient(userOne.token)

    const updatePost = gql `
        mutation {
            updatePost(id: "${postOne.output.id}", data: {
                title: "text",
                body: "test",
                published: false
        } ) {
            title,
            body,
            published
        }
        }
    `

    const {
        data
    } = await client.mutate({
        mutation: updatePost
    })

    const exist = await prisma.exists.Post({
        id: data.updatePost.id,
        published: false
    })

    expect(data.updatePost.published).toBe(false)
    expect(exist).toBe(true)
})

test('Should create Post', async () => {
    const client = getClient(userOne.token)

    const createPost = gql `
        mutation {
            createPost(data: {
                title: "test",
                body: "testtest",
                published: false
            }){
                id
                title
                body
                published
            }
        }
    `

    const {
        data
    } = await client.mutate({
        mutation: createPost
    })

    expect(data.createPost.title).toBe('test')
})

test("Should delete second post", async () => {
    const client = getClient(userOne.token)

    const deletePostMutation = gql `
        mutation {
            deletePost(id: "${postTwo.output.id}") {
                title
                published
                body
                id
            }
        }
    `

    const {
        data
    } = await client.mutate({
        mutation: deletePostMutation
    })

    const exist = await prisma.exists.Post({
        id: postTwo.output.id
    })

    expect(exist).toBe(false)
})