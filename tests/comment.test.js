import '@babel/polyfill/noConflict'

import getClient from './utils/getClient'
import seedDatabase, {
    userOne,
    userTwo,
    commentOne,
    commentTwo,
    postOne
} from './utils/seedDatabase'
import prisma from '../src/prisma'
import {
    deleteComment,
    commentSubscription,
    subscribePost
} from './utils/options'


const client = getClient()

beforeEach(seedDatabase)


test('Should delete Users own comment', async () => {
    const client = getClient(userOne.token)

    const variables = {
        id: commentOne.output.id
    }

    const {
        data
    } = await client.mutate({
        mutation: deleteComment,
        variables
    })

    const exist = await prisma.exists.Comment({
        id: commentOne.output.id
    })

    expect(exist).toBe(false)
})

test('Should not delete other Users comment', async () => {
    const client = getClient(userTwo.token)
    const variables = {
        id: commentOne.output.id
    }

    await expect(client.mutate({
        mutation: deleteComment,
        variables
    })).rejects.toThrow()


    const exist = await prisma.exists.Comment({
        id: commentTwo.output.id
    })

    expect(exist).toBe(true)
})

test('Should subscribe to comment for a post', async (done) => {

    const variables = {
        postId: postOne.output.id
    }

    client.subscribe({
        query: commentSubscription,
        variables
    }).subscribe({
        next(response) {
            expect(response.data.comment.mutation).toBe('DELETED')
            done()
        }
    })

    setInterval(console.log("b"), 2000)

    await prisma.mutation.deleteComment({
        where: {
            id: commentOne.output.id
        }
    })
})
test('Should subscribe to posts', async (done) => {
    client.subscribe({
        query: subscribePost
    }).subscribe({
        next(response) {
            expect(response.data.post.mutation).toBe('DELETED')
            done()
        }
    })
    setInterval(console.log('a'), 2000)

    await prisma.mutation.deletePost({
        where: {
            id: postOne.output.id

        }
    })
})