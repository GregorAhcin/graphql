import jwt from 'jsonwebtoken'

const getUserId = (request, authRequired = true) => {

  const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

  if (header) {
    const token = header.replace("Bearer ", '')

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) // throws an error if wrong secret

    return decoded.userId
  }


  if (authRequired) {
    throw new Error("Authentication required.")
  }


  return null

}

export {
  getUserId as
  default
}