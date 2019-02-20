import '@babel/polyfill/noConflict'

import getClient from './utils/getClient'
import seedDatabase, {
    userOne,
    userTwo,
    commentOne,
    commentTwo
} from './utils/seedDatabase'
import prisma from '../src/prisma'
import {
    deleteComment
} from './utils/options'
import {
    assertObjectType
} from 'graphql';

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