import '@babel/polyfill/noConflict'
//import 'cross-fetch/polyfill'

import {
    gql
} from 'apollo-boost'
import prisma from '../src/prisma'

import seedDatabase, {
    userOne,
    postOne,
    postTwo,
    commentOne
} from './utils/seedDatabase'
import getClient from './utils/getClient'
import {
    getPosts,
    fetchPosts,
    updatePost,
    createPost,
    deletePostMutation,
    commentSubscription

} from './utils/options'

const client = getClient()

beforeEach(seedDatabase)

test('Should return published post', async () => {

    const response = await client.query({
        query: getPosts
    })

    expect(response.data.posts.length).toBe(2)
    expect(response.data.posts[0].published).toBe(true)
    expect(response.data.posts[0].title).toBe("Published post by userOne")
})

test('Should return authenticated User posts', async () => {
    const client = getClient(userOne.token)

    const {
        data
    } = await client.query({
        query: fetchPosts
    })

    expect(data.myPosts.length).toBe(2)

})

test('Should update authenticated User post', async () => {
    const client = getClient(userOne.token)

    const variables = {
        data: {
            title: "text",
            body: "test",
            published: false
        },
        id: postOne.output.id
    }

    const {
        data
    } = await client.mutate({
        mutation: updatePost,
        variables
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

    const variables = {
        data: {
            title: "test",
            body: "testtest",
            published: false
        }
    }

    const {
        data
    } = await client.mutate({
        mutation: createPost,
        variables
    })

    expect(data.createPost.title).toBe('test')
})

test("Should delete second post", async () => {
    const client = getClient(userOne.token)

    const variables = {
        id: postTwo.output.id
    }

    const {
        data
    } = await client.mutate({
        mutation: deletePostMutation,
        variables
    })

    const exist = await prisma.exists.Post({
        id: postTwo.output.id
    })

    expect(exist).toBe(false)
})