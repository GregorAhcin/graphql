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

    // create Post

    await prisma.mutation.createPost({
        data: {
            title: "Published post",
            body: "this is published post",
            published: true,
            author: {
                connect: {
                    id: userOne.output.id
                }
            }
        }
    })
    await prisma.mutation.createPost({
        data: {
            title: 'Unpublished post',
            body: 'this post is not published',
            published: false,
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
    default, userOne
}