import { hashPassword, verifyPassword } from '../utils/password'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'

const Mutation = {
  async loginUser(parent, args, {prisma}, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })
    if(!user) {
      throw new Error("Unable to login.")
    }
    const match = await verifyPassword(args.data.password, user.password)
    if(!match) {
      throw new Error("Unable to login.")
    }

    return {
      user,
      token: generateToken(user.id)
      }
    },

  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({email: args.data.email})

    if (emailTaken) {
      throw new Error("Email already used.")
    }

    const hashedPassword = await hashPassword(args.data.password)

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }})

      return {
        user,
        token: generateToken(user.id)
      }
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const userExists = await prisma.exists.User({id: userId})

    if(!userExists) {
      throw new Error('User not found.')
    }
    return prisma.mutation.deleteUser({where: { id: userId}}, info)
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if(typeof args.data.newPassword === 'string') {
      args.data.password = await hashPassword(args.data.newPassword)
      delete args.data.newPassword
    }
    return prisma.mutation.updateUser({where: { id: userId }, data: args.data }, info)
  },

  async createPost(parent, args, { prisma, request }, info ) {
    const userID = getUserId(request)

    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: userID
          }
        }
    }}, info)
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    if(!postExist){
      throw new Error('No post found.')
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info)
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    })

    const postToBeUnPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    })

    if(!postExist) {
      throw new Error("No post.")
    }
    if(postToBeUnPublished && args.data.published === false) {
      const postCount = await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: args.id
          }
        }})
    }
    return prisma.mutation.updatePost({
      data: args.data,
      where: {
        id: args.id
      }
    }, info)
  },

  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const postPublished = await prisma.exists.Post({
      id: args.data.post,
      published: true
    })

    if(!postPublished) {
      throw new Error("Post does not exists.")
    }

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        post: {
          connect: {
            id: args.data.post
          }
        },
        author: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!commentExist) {
      throw new Error('No comment found.')
    }

    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info)
  },

  async updateComment(parent, args, { prisma, request }, info ) {
    const userId = getUserId(request)
    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    })

    if (!commentExist) {
      throw new Error('No comment found.')
    }
    return prisma.mutation.updateComment({
      data: {
        text: args.data.text
      },
      where: {
        id: args.id
      }
    }, info)
  }
}

export { Mutation as default}