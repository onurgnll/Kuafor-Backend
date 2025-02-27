const JWT = require('jsonwebtoken');
const { Coiffeur } = require('../models');

const coiffeurAuth = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("asdıjasıfjasıfa");
    if (token == null) {
        return res.status(401).json({
            success: -1,
            data: [],
            message: "Tekrar giriş yapınız"
        }) 
    }
    const currentUser = await Coiffeur.findOne({where: {accessToken: token}});

    console.log("asdıjasıfjasıfa");
    if(currentUser) {
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {

            if (err) {
                return res.status(401).json({
                    success: -1,
                    data: [],
                    message: "Tekrar giriş yapınız"
                })
            }

            console.log("asdıjasıfjasıfa");
            req.coiffeur = user;
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

module.exports = coiffeurAuth;