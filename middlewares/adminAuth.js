const JWT = require('jsonwebtoken');
const { Admin } = require('../models');

const adminAuth = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            success: -1,
            data: [],
            message: "Tekrar giriş yapınız"
        }) 
    }

    const currentUser = await Admin.findOne({where: {accessToken: token}});

    if(currentUser) {
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {

            if (err) {
                return res.status(401).json({
                    success: -1,
                    data: [],
                    message: "Tekrar giriş yapınız"
                })
            }

            req.admin = user;
            next();

        });

    }
    else {
        return res.status(401).json({
            success: -1,
            data: [],
            message: "Tekrar giriş yapınız"
        }) 
    }

}

module.exports = adminAuth;