import jwt from 'jsonwebtoken'

const generateToken = userId => jwt.sign({
    userId: userId
}, process.env.TOKEN_SECRET, {
    expiresIn: '2 days'
})

export {
    generateToken as
    default
}