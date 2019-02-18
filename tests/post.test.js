import '@babel/polyfill/noConflict'
import 'cross-fetch/polyfill'

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