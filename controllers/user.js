

const { where, Op, Sequelize } = require("sequelize");
const { cryptPassword } = require("../helpers/cryptPassword");
const Response = require("../responses/response");
const { City, District, User, Coiffeur, Reservation, ReservationType, CoiffeurProperty, Payment } = require("../models");
const CustomError = require("../errors/CustomError");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../helpers/token");
const { pagination } = require("../helpers/pagination");

const { v4: uuidv4 } = require('uuid');
const Firebase = require('../utils/firebase');
const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_IYZIPAY_URI
});

const register = tryCatchWrapper(

    async (req, res, next) => {
        const { name, surname, password, phoneNumber, gender, cityID, districtID } = req.body


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


    }

)



const login = tryCatchWrapper(

    async (req, res, next) => {

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



    }
)



const createReservation = tryCatchWrapper(async (req, res, next) => {

    const { reservationTypeIDs, coiffeurID, resDate, cardHolderName, cardNumber, expireMonth, expireYear, cvc } = req.body


    const user = await User.findOne({ where: { id: req.user.result }, include: { model: City } })

    const coiffeur = await Coiffeur.findOne({ where: { id: coiffeurID } })

    const coiffeurProps = await CoiffeurProperty.findOne({ where: { coiffeurID } })


    if (coiffeur.isApproved != true) return res.json(new Response(-1, null, "Kuaför onaylı değil."));

    if (coiffeur.iyzicoExternalID == null) return res.json(new Response(-1, null, "Kuaför iyzico kayıtlı değil."));

    console.log(coiffeurProps);
    if (coiffeurProps.resActive == false) return res.json(new Response(-1, null, "Kuaför rezervasyonları devre dışı."));

    if (coiffeurProps.gender != user.gender) return res.json(new Response(-1, null, "Kuaför cinsiyete uygun değil."));

    const isRes = await Reservation.findAll({
        where: {
            resDate: {
                [Op.eq]: resDate
            },
            isApproved: true
        }
    })

    if (isRes.length == coiffeurProps.employeeCount) return res.json(new Response(-1, null, "Belirtilen saatte tüm çalışanlar dolu."));



    let conversationID = req.user?.result + '_' + uuidv4();


    var totalPrice = 0

    for (const resTypeID of reservationTypeIDs) {
        const type = await ReservationType.findOne({ where: { id: resTypeID } })
        if (!type) return res.json(new Response(-1, {}, "Bu rezervasyon tipi bulunamadı."))

        totalPrice += type.price
    }


    const reservation = await Reservation.create({
        coiffeurID,
        userID: user.id,
        resTypeIDs: [...reservationTypeIDs],
        totalPrice: totalPrice,
        resDate: new Date(resDate),
        isApproved: null,
        merchantOid: conversationID,
        status: "payment_started"


    })

    const payment = await Payment.create({
        coiffeurID,
        reservationID: reservation.id,
        totalPrice,
        status: "started",
        merchantOid: conversationID
    })




    const request = {
        locale: 'tr',
        conversationId: conversationID,         // üye işyerinin sipariş numarası
        price: totalPrice,
        paidPrice: totalPrice,
        currency: 'TRY',
        installments: '1',           // taksit!!
        // callbackUrl: process.env.FINISH_PAYMENT_URL,
        paymentCard: {
            cardHolderName: cardHolderName,
            cardNumber: cardNumber,
            expireMonth: expireMonth,
            expireYear: expireYear,
            cvc: cvc,
        },
        buyer: {
            id: `BY${req.user?.result}`,
            name: user.name,
            surname: user.surname,
            identityNumber: "11111111111",
            city: user.City.name,               // ?
            country: "Türkiye",
            email: "default@defaulttt.com",
            ip: 'localhost',                 // server ip
            registrationAddress: "Yokkkkk"
        },
        billingAddress: {
            contactName: `${user.name} ${user.surname}`,
            city: user.City.name,
            country: "Türkiye",
            address: "Yokkkkk"
        },
        shippingAddress: {
            contactName: `${user.name} ${user.surname}`,
            city: user.City.name,
            country: "Türkiye",
            address: "Yokkkkk"

        },
        basketItems: [
            {
                id: reservation.id + "_" + user.id,               // siparişe ait id
                itemType: 'VIRTUAL',
                name: `${user.name}_${user.surname}_odeme`,
                category1: 'Kuafor Rezervasyonu',
                price: totalPrice,
                subMerchantKey: coiffeur.iyzicoMerchantID,
                subMerchantPrice: (totalPrice * 93 / 100)
            }
        ]
    };


    console.log(request);
    const result = await new Promise((resolve, reject) => {


        iyzipay.payment.create(request, async(err,ress) => {
            

            if (err) {

                return next(new CustomError("Error occured in threedsInitialize method", -2));
            } else {
                if (ress.status === "success") {
                    if (ress.conversationId == conversationID) {

                        console.log(ress);
                        
                        const reservation2 = await Reservation.update({ status: "payment_success", paymentTransactionID: ress.itemTransactions[0].paymentTransactionId }, { where: { id: reservation.id } })


                        const paymentt = await Payment.update({ status: "success" }, { where: { reservationID: reservation.id } })


                        const returnRes = await Reservation.findOne({where: {id: reservation.id }})
                        const paymentreturn = await Payment.findOne({where: {reservationID: reservation.id}})

                        return res.json({
                            success: 1,
                            data: [{reservation: returnRes , payment: paymentreturn}],
                            mesage: ""
                        })
                    }
                } else {


                    await Reservation.update({ status: "payment_failed", paymentTransactionID: ress.itemTransactions[0].paymentTransactionId }, { where: { id: reservation.id } })

                    await Payment.update({ status: "failed" }, { where: { reservationID: reservation.id } })


                    return res.json({
                        success: -parseInt(ress.errorCode),
                        data: [],
                        message: ress.errorMessage
                    })
                }
            }
        })


        // iyzipay.threedsInitialize.create(request, async (err, result) => {


        //     if (err) {

        //         return next(new CustomError("Error occured in threedsInitialize method", -2));
        //     } else {
        //         if (result.status === "success") {
        //             if (result.conversationId == conversationID) {

        //                 const buffered = Buffer.from(result.threeDSHtmlContent, 'base64').toString("utf8");       // base64 to utf-8
        //                 return res.json({
        //                     success: 1,
        //                     data: [{ Result: result, Buffered: buffered }],
        //                     mesage: ""
        //                 })
        //             }
        //         } else {


        //             return res.json({
        //                 success: -parseInt(result.errorCode),
        //                 data: [],
        //                 message: result.errorMessage
        //             })
        //         }
        //     }
        // });
    });

    console.log(result);
    res.send("ok")

})


const finishPayment = async (req, res, next) => {
    try {
        let { paymentId, conversationId } = req.body;

        if (req.body.status === 'failure') {
            return res.redirect(`${process.env.PAYMENT_FAIL_URL}`);
        } else {
            await new Promise((resolve, reject) => {
                iyzipay.threedsPayment.create({
                    locale: 'tr',
                    conversationId: conversationId,
                    paymentId: paymentId,
                }, async (err, result) => {
                    if (err) {
                        return res.redirect(`${process.env.PAYMENT_FAIL_URL}`);
                    } else {
                        if (result.status === 'success') {

                            const resID = result.itemTransactions[0].itemId.split("_")[0];


                            const userID = result.itemTransactions[0].itemId.split("_")[1]


                            await Payment.update({ status: "success" }, { where: { reservationID: resID } })



                            const user = await User.findOne({ where: { id: userID } });

                            if (!user) return res.redirect(`${process.env.CLIENT_URL}/basarisiz`);


                            await Reservation.update({ status: "payment_success" }, { where: { id: resID } })

                            // await new Promise((resolve, reject) => {
                            //     iyzipay.approval.create({
                            //         locale: Iyzipay.LOCALE.TR,
                            //         conversationId: uuidv4(),
                            //         paymentTransactionId: result.itemTransactions[0].paymentTransactionId,
                            //     }, (err, result) => {
                            //         if (err) {
                            //             console.log(err);
                            //             reject(err);
                            //         } else {
                            //             console.log(result);
                            //             resolve(result);
                            //         }
                            //     });
                            // });
                            return res.redirect(`${process.env.PAYMENT_SUCCESS_URL}`);
                        } else {

                            return res.redirect(`${process.env.PAYMENT_FAIL_URL}`);
                        }
                    }
                });
            });
        }
    } catch (error) {
        console.error(error);
        return res.redirect(`${process.env.PAYMENT_FAIL_URL}`);
    }


}


const listReservations = tryCatchWrapper(async (req, res, next) => {

    const { past } = req.body

    const page = req.query.page ? req.query.page : 1;
    const per_page = 10;


    let whereClause = {};

    whereClause.userID = req.user.result
    whereClause.status = { [Op.ne]: "payment_started" }

    if (past) {
        whereClause.resDate = { [Op.lt]: new Date() }
    } else {
        whereClause.resDate = { [Op.gte]: new Date() }
    }

    const reservations = await Reservation.findAll({
        where: whereClause,
        limit: per_page,
        offset: (page - 1) * per_page,
    })

    let formattedReservations = []
    for (let reservation of reservations) {
        // resTypeID'lerin hepsini aynı anda getirir
        const resTypes = await Promise.all(
            reservation.resTypeIDs.map(resTypeID =>
                ReservationType.findOne({ where: { id: resTypeID } })
            )
        );

        // reservation nesnesini ve yeni alanı birleştir
        formattedReservations.push({
            ...reservation.toJSON(),
            resTypes
        });
    }

    const count = await Reservation.count({ where: whereClause })


    const paginated = pagination({ data: reservations, count, per_page, page })

    res.json(new Response(1, { reservations: paginated }, ""))

})

const searchCoiffeur = tryCatchWrapper(async (req, res, next) => {

    const { cityID, districtID, name, gender } = req.body


    const page = req.query.page ? req.query.page : 1;
    const per_page = 10;


    const whereClause = {
        
    }
    
    if(name){
        whereClause.name = { [Op.iLike]: `%${name}%` }
        
    }
    const includeConditions = {

        model: CoiffeurProperty,
        where: {

            gender: gender || ["male", "female"],
        }

    }

    if (cityID) {
        whereClause.cityID = cityID
    }

    if (districtID) {
        whereClause.districtID = districtID
    }

    const coiffeurs = await Coiffeur.findAll({
        where: whereClause,
        limit: per_page,
        offset: (page - 1) * per_page,
        include: includeConditions
    })


    const count = await Coiffeur.count({ where: whereClause })

    const paginated = pagination({
        data: coiffeurs, count, per_page,
        page
    })

    res.json(new Response(1, { coiffeurs: paginated }, ""))

})


module.exports = {
    login,
    register,
    createReservation,
    finishPayment,
    listReservations,
    searchCoiffeur
}