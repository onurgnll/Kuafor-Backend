

const { where, Op, Sequelize } = require("sequelize");
const { cryptPassword } = require("../helpers/cryptPassword");
const Response = require("../responses/response");
const { City, District, User } = require("../models");
const CustomError = require("../errors/CustomError");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../helpers/token");
const { pagination } = require("../helpers/pagination");

const Firebase = require('../utils/firebase');
const register = async (req, res, next) => {
    try {
        const { name, surname, password, phoneNumber,gender, cityID, districtID } = req.body


        const isUser = await User.findOne({ where: { phoneNumber } })

        if (isUser) {
            return res.status(200).json(new Response(-1, null, "Bu telefon zaten kullanılıyor."));
        }


        const hashedPassword = await cryptPassword(password)

        let result = ""
        if (req.file && req.file !== null) {

            result = await Firebase.uploadFile(req.file, 'profilePictures', (err, data) => {
                if (err) {
                    return next(new CustomError(err, -1));
                } else {
                    return data;
                }
            });
        }

        const created = await User.create({
            name, surname, password: hashedPassword, phoneNumber, cityID, districtID, picture: result, gender
        })


        return res.status(200).json(new Response(1, { user: created }, "Başarıyla kayıt olundu."));
    } catch (error) {
        console.error(error);
        next(new CustomError())

    }

}


const login = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        phoneNumber,
                    },
                ],
            },
            include: [
                {
                    model: City
                },

                {
                    model: District
                }
            ]
        });

        if (!user) {
            return res.status(404).json(new Response(-1, null, "Böyle bir kullanıcı bulunamadı"));
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json(new Response(-1, null, "Yanlış şifre"));
        }

        const token = {
            accessToken: generateAccessToken(user.id),
            refreshToken: generateRefreshToken(user.id)
        }
        await User.update(
            {
                accessToken: token.accessToken,
                refreshToken: token.refreshToken
            },
            {
                where: { id: user.id },
            }
        );


        const updatedUser = await User.findOne({
            where: {
                id: user.id,
            },
            attributes: { exclude: ['password', 'accessToken', "refreshToken"] }
        });

        // Başarılı yanıt döndür
        res.status(200).json(new Response(1, { user: updatedUser, token }, "success"));


    } catch (error) {
        console.error(error);
        next(new CustomError())

    }

}


module.exports = {
    login,
    register,
}