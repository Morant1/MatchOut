const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const saltRounds = 10

async function login(email, password) {


    logger.debug(`auth.service - login with username: ${email}`)
    if (!email || !password) return Promise.reject('username and password are required!')

    const user = await userService.getByEmail(email)
    console.log("email",email)
    console.log("password",password)
    console.log("user,login-",user)
    if (!user) return Promise.reject('Invalid username or password')
    const match = await bcrypt.compare(password, user.password)
    console.log("match",match)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password;
    return user;
}



async function signup(email, password) {
    logger.debug(`auth.service - signup with username: ${email}`)
    if ( !email || !password) return Promise.reject('username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({email, password: hash})
}

module.exports = {
    signup,
    login
}