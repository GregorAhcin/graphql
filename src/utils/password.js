import bcrypt from 'bcryptjs'

const hashPassword = password => {
  if (password.length < 6 ) {
    throw new Error('Password has to be 6 characters long.')
  } 
  return bcrypt.hash(password, 10)
}

const verifyPassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export { hashPassword, verifyPassword }