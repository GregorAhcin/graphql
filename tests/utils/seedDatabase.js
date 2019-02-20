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

const userTwo = {
    input: {
        name: "Janez",
        email: "janez@test.si",
        password: bcrypt.hashSync("janezjanez")
    },
    output: undefined,
    token: undefined
}

const postOne = {
    input: {
        title: "Published post by userOne",
        body: "this is published post",
        published: true
    },
    output: undefined
}

const postTwo = {
    input: {
        title: 'Unpublished post by userOne',
        body: 'this post is not published',
        published: false,
    },
    output: undefined
}
const postThree = {
    input: {
        title: "Published post by userTwo",
        body: '',
        published: true
    },
    output: undefined
}
const commentOne = {
    input: {
        text: "Comment from first user"
    },
    output: undefined
}
const commentTwo = {
    input: {
        text: "Comment from second user"
    },
    output: undefined
}

const seedDatabase = async () => {

    // Clear database
    await prisma.mutation.deleteManyComments()
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()

    // Seed user to database

    userOne.output = await prisma.mutation.createUser({
        data: userOne.input
    })

    userOne.token = await jwt.sign({
        userId: userOne.output.id
    }, process.env.TOKEN_SECRET)


    userTwo.output = await prisma.mutation.createUser({
        data: userTwo.input
    })

    userTwo.token = await jwt.sign({
        userId: userTwo.output.id
    }, process.env.TOKEN_SECRET)

    // seed Posts to database

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

    postThree.output = await prisma.mutation.createPost({
        data: {
            ...postThree.input,
            author: {
                connect: {
                    id: userTwo.output.id
                }
            }
        }
    })

    // seed comments to db

    commentOne.output = await prisma.mutation.createComment({
        data: {
            ...commentOne.input,
            author: {
                connect: {
                    id: userOne.output.id
                }
            },
            post: {
                connect: {
                    id: postOne.output.id
                }
            }
        }
    })

    commentTwo.output = await prisma.mutation.createComment({
        data: {
            ...commentTwo.input,
            author: {
                connect: {
                    id: userTwo.output.id
                }
            },
            post: {
                connect: {
                    id: postOne.output.id
                }
            }
        }
    })

}

export {
    seedDatabase as
    default, userOne, postOne, postTwo, userTwo, postThree, commentOne, commentTwo
}