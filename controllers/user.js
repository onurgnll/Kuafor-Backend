

const { where, Op, Sequelize } = require("sequelize");
const { cryptPassword } = require("../helpers/cryptPassword");
const Response = require("../responses/response");
const { City, District, User, Coiffeur, Reservation, ReservationType, CoiffeurProperty, Payment, Review } = require("../models");
const CustomError = require("../errors/CustomError");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../helpers/token");
const { pagination } = require("../helpers/pagination");

const { v4: uuidv4 } = require('uuid');
const Firebase = require('../utils/firebase');
const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const Iyzipay = require("iyzipay");
const { createUserNotification, createCoiffeurNotification } = require("./notifications");
const { formatDate, newDate } = require("../helpers/formatDate");

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

    const a = new Date()

    const { reservationTypeIDs, coiffeurID, resDate, cardHolderName, cardNumber, expireMonth, expireYear, cvc } = req.body


    const user = await User.findOne({ where: { id: req.user.result }, include: { model: City } })

    const coiffeur = await Coiffeur.findOne({ where: { id: coiffeurID } })

    const coiffeurProps = await CoiffeurProperty.findOne({ where: { coiffeurID } })

    if (newDate() > newDate(resDate)) return res.json(new Response(-1, null, "Geçmiş zamana res oluşturulamaz"))


    if (coiffeur.isApproved != true) return res.json(new Response(-1, null, "Kuaför onaylı değil."));

    if (coiffeur.iyzicoExternalID == null) return res.json(new Response(-1, null, "Kuaför iyzico kayıtlı değil."));

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


    let resdatee = new Date(resDate)
    resdatee.setHours(resdatee.getHours() + 3)

    const reservation = await Reservation.create({
        coiffeurID,
        userID: user.id,
        resTypeIDs: [...reservationTypeIDs],
        totalPrice: totalPrice,
        resDate: resdatee,
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
        conversationId: conversationID,
        price: totalPrice,
        paidPrice: totalPrice,
        currency: 'TRY',
        installments: '1',
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
            city: user.City.name,
            country: "Türkiye",
            email: "default@defaulttt.com",
            ip: 'localhost',
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

    const result = await new Promise((resolve, reject) => {


        iyzipay.payment.create(request, async (err, ress) => {


            if (err) {

                return next(new CustomError("Error occured in threedsInitialize method", -2));
            } else {
                if (ress.status === "success") {
                    if (ress.conversationId == conversationID) {


                        const reservation2 = await Reservation.update({ status: "payment_success", paymentTransactionID: ress.itemTransactions[0].paymentTransactionId }, { where: { id: reservation.id } })


                        const paymentt = await Payment.update({ status: "success" }, { where: { reservationID: reservation.id } })


                        await createUserNotification(user.id, "Rezervasyon Oluşturuldu", `${coiffeur.name} isimli kuaföre ${formatDate(resDate)} tarihi için rezervasyonunu oluşturdun.`)
                        await createCoiffeurNotification(coiffeur.id, "Bir Rezervasyon oluşturuldu.", `${user.name}, ${formatDate(reservation.resDate)} tarihi için rezervasyon oluşturdu onayını bekliyor!`)
                        const returnRes = await Reservation.findOne({ where: { id: reservation.id } })
                        const paymentreturn = await Payment.findOne({ where: { reservationID: reservation.id } })

                        return res.json({
                            success: 1,
                            data: [{ reservation: returnRes, payment: paymentreturn }],
                            mesage: ""
                        })
                    }
                } else {


                    await Reservation.destroy({ where: { id: reservation.id } })

                    await Payment.destroy({ where: { reservationID: reservation.id } })


                    return res.json({
                        success: -parseInt(ress.errorCode),
                        data: [],
                        message: ress.errorMessage
                    })
                }
            }
        })

    });

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


    const paginated = pagination({ data: formattedReservations, count, per_page, page })

    res.json(new Response(1, { reservations: paginated }, ""))

})

const searchCoiffeur = tryCatchWrapper(async (req, res, next) => {

    const { cityID, districtID, name, gender } = req.body


    const page = req.query.page ? req.query.page : 1;
    const per_page = 10;


    const whereClause = {

    }

    if (name) {
        whereClause.name = { [Op.iLike]: `%${name}%` }

    }
    const includeConditions = [
        {

            model: CoiffeurProperty,
            where: {

                gender: gender || ["male", "female"],
            }

        },
        {
            model: City
        },
        {
            model: District
        }
    ]

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



const cancelReservation = tryCatchWrapper(async (req, res, next) => {

    const { reservationID } = req.body


    const user = await User.findOne({ where: { id: req.user.result } })

    const reservation = await Reservation.findOne({
        where: {
            id: reservationID,
            userID: req.user.result,
        }
    })


    if (reservation.status == "finished") {
        return res.json(new Response(-1, null, "Tamamlanan rezervasyonlar iptal edilemez!"))
    }
    if (reservation.status == "payment_failed") {
        return res.json(new Response(-1, null, "ödemesi tamamlanmayan rezervasyonlar iptal edilemez!"))
    }
    if (reservation.status == "canceled") {
        return res.json(new Response(-1, null, "Zaten iptal edilmiş"))
    }

    const now = newDate()

    const resDate = new Date(reservation.resDate)


    resDate.setHours(resDate.getHours() - 1)


    if (now > resDate) {
        return res.json(new Response(-1, null, "Rezervasyon en geç 1 saat kala iptal edilebilir."))

    }



    const request = {
        paymentTransactionId: reservation.paymentTransactionID,
        price: reservation.totalPrice
    }


    const result = await new Promise((resolve, reject) => {


        iyzipay.refund.create(request, async (err, ress) => {


            if (err) {

                return next(new CustomError("Error occured in method", -2));
            } else {
                if (ress.status === "success") {

                    await Reservation.update({ status: "canceled" }, { where: { id: reservation.id } })
                    await Payment.update({ status: "canceled" }, { where: { reservationID: reservation.id } })

                    await createCoiffeurNotification(reservation.coiffeurID, "Bir Rezervasyon İptal Edildi.", `${user.name} ${user.surname} ${formatDate(new Date(reservation.resDate))} Tarihindeki rezervasyonunu iptal etti.`)



                    return res.json(new Response(1, null, "Başarıyla iade edildi"))
                } else {


                    return res.json({
                        success: -parseInt(ress.errorCode),
                        data: [],
                        message: ress.errorMessage
                    })
                }
            }
        })





    })
})



const reviewCoiffeur = tryCatchWrapper(async (req, res, next) => {

    const { coiffeurID, content, point } = req.body

    const userID = req.user.result



    const review = await Review.findOne({ where: { userID, coiffeurID } })

    if (review) return res.json(new Response(-1, null, "Zaten değerlendirmişsin."));


    const reservation = await Reservation.findOne({ where: { userID, coiffeurID, status: "finished" } })

    if (!reservation) return res.json(new Response(-1, null, "Bu kuaförde tamamlanan rezervasyon yok."));


    const coiff = await Coiffeur.findOne({ where: { id: coiffeurID } })

    const revieww = await Review.create({
        userID,
        coiffeurID,
        content,
        point
    })

    const user = await User.findOne({ where: { id: userID } })

    await createCoiffeurNotification(coiffeurID, "Kuaförün bir müşteri tarafından değerlendirildi", `${user.name} ${user.surname} verdiğin hizmete ${point} yıldız verdi.`)

    await Coiffeur.update({ totalPoint: (coiff.totalPoint + point), reviewCount: (coiff.reviewCount + 1) }, { where: { id: coiffeurID } })

    return res.json(new Response(1, { review: revieww }, ""))

})


const getCoiffeurDetails = tryCatchWrapper(async (req, res, next) => {
    const {id} = req.params

    
    const coiffeur = await Coiffeur.findOne({ where: { id }  , include : [{model: City} , {model: District} , {model: CoiffeurProperty}]} )

    if(!coiffeur) return res.json(new Response(-1, {  }, "Böyle bir kuaför bulunamadı"))
    return res.json(new Response(1, { coiffeur }, ""))

})


module.exports = {
    login,
    register,
    createReservation,
    finishPayment,
    listReservations,
    searchCoiffeur,
    cancelReservation,
    getCoiffeurDetails
}