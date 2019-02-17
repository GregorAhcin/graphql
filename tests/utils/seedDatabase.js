import prisma from '../../src/prisma'
import bcrypt from 'bcryptjs'

const seedDatabase = async () => {
    await prisma.mutation.deleteManyPosts()
    await prisma.mutation.deleteManyUsers()
    const uporabnik = await prisma.mutation.createUser({
        data: {
            name: "Tatjana",
            email: "tatjana@test.si",
            password: bcrypt.hashSync("tatjana")
        }
    })

    await prisma.mutation.createPost({
        data: {
            title: "Published post",
            body: "this is published post",
            published: true,
            author: {
                connect: {
                    id: uporabnik.id
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
                    id: uporabnik.id
                }
            }
        }
    })
}

export {
    seedDatabase as
    default
}