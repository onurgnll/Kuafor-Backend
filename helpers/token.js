const JWT = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return JWT.sign({result: user}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '7200000'});           // 900000 - 15 min
}

const generateRefreshToken = (user) => {
    return JWT.sign({result: user}, process.env.REFRESH_TOKEN_SECRET_KEY);
}
module.exports = {
    generateAccessToken,
    generateRefreshToken
}