import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userOne = {
    input: {
        name: "Tatjana",
        email: "tatjana@test.si",
        password: bcrypt.hashSync("tatjana")
    },
    output: undefined,
    token: undefined
}

const postOne = {
    input: {
        title: "Published post",
        body: "this is published post",
        published: true
    },
    output: undefined
}

const postTwo = {
    input: {
        title: 'Unpublished post',
        body: 'this post is not published',
        published: false,
    },
    output: undefined
}

const seedDatabase = async () => {

    // Clear database

    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Seed user to database

    userOne.output = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.token = await jwt.sign({
        userId: userOne.output.id
    }, process.env.TOKEN_SECRET)

    // seed first Post to database

    postOne.output = await prisma.mutation.createPost({
        data: {
            ...postOne.input,
            author: {
                connect: {
                    id: userOne.output.id
                }
            }
        }
    })

    // seed second Post to db

    postTwo.output = await prisma.mutation.createPost({
        data: {
            ...postTwo.input,
            author: {
                connect: {
                    id: userOne.output.id
                }
            }
        }
    })
}

export {
    seedDatabase as
    default, userOne, postOne, postTwo
}