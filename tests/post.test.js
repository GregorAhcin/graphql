import '@babel/polyfill/noConflict'
import 'cross-fetch/polyfill'

import ApolloBoost, {
    gql
} from 'apollo-boost'
import prisma from '../src/prisma'

import seedDatabase from './utils/seedDatabase'
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