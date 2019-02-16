import {extractFragmentReplacements} from 'prisma-binding'

import Query from './Query'
import User from './User'
import Post from './Post'
import Comment from './Comment'
import Mutation from './Mutation'
import Subscription from './Subscription'

const resolvers = {
  Query,
  User,
  Post,
  Comment,
  Mutation,
  Subscription
}

const fragmentReplacements = extractFragmentReplacements(resolvers)


export { fragmentReplacements, resolvers }