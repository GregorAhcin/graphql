var getFullName = (firstName, lastName) => {
    return firstName + " " + lastName
}

var isValidPassword = (password) => {
    return password.length >= 8 && !password.toLowerCase().includes('password')
}
export {
    getFullName,
    isValidPassword
}