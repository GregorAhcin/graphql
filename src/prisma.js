import {
  Prisma
} from "prisma-binding";
import {
  fragmentReplacements
} from "./resolvers/index";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements
});
export {
  prisma as
  default
};

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId})

//   if (!userExists) {
//     throw new Error("User not found.")
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, "{ author { id name email posts { id title body published } } } ")

//   return post.author
// }

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId})

//   if(!postExists) {
//     throw new Error("No post found.")
//   }

//   const updatedPost = await prisma.mutation.updatePost({
//     data,
//     where: {
//         id: postId
//     }
//   }, "{ author { id name email posts { title body published } } }")

//   return updatedPost.author
// }

// // createPostForUser("cjq4zn57h002b0796zr69z1sg", {
// //   title: "nov post",
// //   body: "await post",
// //   published: false
// // }).then(user => {
// //   console.log(user)
// // }).catch(e => {
// //   console.log(e.message)
// // })

// updatePostForUser("%", { published: false, title: "aaa" })
//   .then(user => {
//     console.log(user)
//   })
//   .catch(e => {
//     console.log(e.message)
//   })

// // prisma.query.users(null, '{ id name email posts { id title }}').then(data => {
// //   console.log(JSON.stringify(data, undefined, 2))
// // })

// // prisma.query.comments(null, '{ id text author { id name }}').then(data => {
// //   console.log(JSON.stringify(data, undefined, 2))
// // })