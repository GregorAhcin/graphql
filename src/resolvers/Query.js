import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, {
    prisma
  }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },

  posts(parent, args, {
    prisma
  }, info) {
    const opArgs = {
      where: {
        published: true
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    }
    return prisma.query.posts(opArgs, info)
  },

  async myPosts(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    const opArgs = {
      where: {
        author: {
          id: userId
        }
      },
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    }

    return prisma.query.posts(opArgs, info)
  },

  async comments(parent, args, {
    prisma
  }, info) {

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    const comments = await prisma.query.comments(opArgs, info)

    return comments
  },

  async post(parent, args, {
    prisma,
    request
  }, info) {

    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info)

    if (posts.length === 0) {
      throw new Error('No post found.')
    }

    return posts[0]
  },

  async me(parent, args, {
    prisma,
    request
  }, info) {
    const userId = getUserId(request)

    const user = await prisma.query.user({
      where: {
        id: userId
      }
    }, info)

    return user
  }
}

export {
  Query as
  default
}