const CustomError = require("../errors/CustomError");
const bcrypt = require("bcrypt");
const { City, District, User, Coiffeur, CoiffeurNotification, CoiffeurProperty, Payment, Reservation, Review, ReservationType, UserNotification } = require("../models");
const Response = require("../responses/response");
const { generateAccessToken, generateRefreshToken } = require("../helpers/token");
const { Op, where } = require("sequelize");
const { cryptPassword } = require("../helpers/cryptPassword");
const Firebase = require('../utils/firebase');
const { pagination } = require("../helpers/pagination");
const Iyzipay = require('iyzipay');
const { v4: uuidv4 } = require('uuid');
const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const { newDate } = require("../helpers/formatDate");
const { createUserNotification } = require("./notifications");


const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_IYZIPAY_URI
});

const registerToIyzico = tryCatchWrapper(async (req, res, next) => {

    const { iban, ownerName, ownerSurname } = req.body


    const coiffeur = await Coiffeur.findOne({ where: { id: req.coiffeur.result } })


    if (coiffeur.iyzicoExternalID != null) {
        return next(new CustomError("Zaten Kayıtlı!"))
    }

    const externalId = uuidv4()


    await new Promise((resolve, reject) => {
        iyzipay.subMerchant.create(
            {
                locale: Iyzipay.LOCALE.TR,
                conversationId: uuidv4(),
                subMerchantExternalId: externalId,
                subMerchantType: Iyzipay.SUB_MERCHANT_TYPE.PERSONAL,
                address: coiffeur.address,
                email: coiffeur.email,
                gsmNumber: coiffeur.phoneNumber,
                contactSurname: ownerName,
                contactName: ownerSurname,
                iban: iban,
                currency: Iyzipay.CURRENCY.TRY
            },
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return next(new CustomError("Alt uye isyeri ekleme basarisiz", -1));
                } else {
                    if (result.status === "success") {

                        await Coiffeur.update({
                            ownerName,
                            ownerSurname,
                            iban,
                            iyzicoExternalID: externalId,
                            iyzicoMerchantID: result.subMerchantKey
                        }, { where: { id: req.coiffeur.result } })



                        return res.status(200).json(new Response(1, {}, "Başarıyla kayıt olundu."));
                    } else {
                        return res.json({
                            success: -parseInt(result.errorCode),
                            data: [],
                            message: result.errorMessage
                        });
                    }

                }
            }
        );
    });


})



const register = tryCatchWrapper(async (req, res, next) => {


    const { name, password, email, phoneNumber, districtID, cityID, address } = req.body;


    const dist = await District.findOne({ where: { id: districtID } })
    if (!dist) return next(new CustomError("Bu ilçe bulunamadı", -1))

    const isCoif = await Coiffeur.findOne({
        where: {
            phoneNumber
        }
    })

    if (isCoif) {
        return res.status(400).json(new Response(-1, null, "Bu telefon numarası zaten kullanılıyor."))
    }


    const hashedPassword = await bcrypt.hash(password, 12)

    const coiffeur = await Coiffeur.create({
        name,
        email,
        phoneNumber,
        districtID,
        cityID,
        password: hashedPassword,
        isApproved: true,
        address
    })



    return res.status(200).json(new Response(1, { coiffeur }, "Başarıyla kayıt olundu."));

})


const login = tryCatchWrapper(async (req, res, next) => {


    const { phoneNumber, password } = req.body

    const coiffeur = await Coiffeur.findOne({ where: { phoneNumber } })

    if (!coiffeur) {
        return res.status(404).json(new Response(-1, null, "Kayıtlı değil"));
    }

    const passwordMatch = await bcrypt.compare(password, coiffeur.password);

    if (!passwordMatch) {
        return res.status(404).json(new Response(-1, null, "Yanlış şifre"));
    }

    // AccessToken oluştur ve kullanıcıya atama
    const tokens = { accessToken: generateAccessToken(coiffeur.id), refreshToken: generateRefreshToken(coiffeur.id) };

    await Coiffeur.update({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }, { where: { id: coiffeur.id } })

    const coiffeur2 = await Coiffeur.findOne({ where: { phoneNumber } })

    return res.status(200).json(new Response(1, { coiffeur: coiffeur2, tokens }, ""))

})



const updateProfile = tryCatchWrapper(async (req, res, next) => {
    const { resStartTime, resEndTime, employeeCount, resActive, gender } = req.body

    const props = await CoiffeurProperty.findOne({ where: { coiffeurID: req.coiffeur.result } })


    let resultt = [];
    if (req.files && req.files !== null) {
        for (const file of req.files.pictures) {

            await Firebase.uploadFile(file, 'pictures', (err, data) => {
                if (err) {
                    return next(new CustomError(err, -1));
                } else {
                    resultt.push(data);
                }
            });
        }
    }

    if (props) {


        await CoiffeurProperty.update({
            resStartTime,
            resEndTime,
            employeeCount,
            resActive,
            gender,
            pictures: resultt
        }, { where: { coiffeurID: req.coiffeur.result } })
    } else {
        await CoiffeurProperty.create({
            coiffeurID: req.coiffeur.result,
            resStartTime,
            resEndTime,
            employeeCount,
            resActive,
            gender,
            pictures: resultt
        })

    }

    const coiffeur = await Coiffeur.findOne({
        where: { id: req.coiffeur.result },
        include: {
            model: CoiffeurProperty
        }
    })

    return res.json(new Response(1, coiffeur, ""))


})

const addPicture = tryCatchWrapper(async (req, res, next) => {

    const props = await CoiffeurProperty.findOne({ where: { coiffeurID: req.coiffeur.result } })


    let resultt = [];
    if (req.files && req.files !== null) {
        for (const file of req.files.pictures) {

            await Firebase.uploadFile(file, 'pictures', (err, data) => {
                if (err) {
                    return next(new CustomError(err, -1));
                } else {
                    resultt.push(data);
                }
            });
        }
    }

    const merged = props.pictures.concat(resultt)


    await CoiffeurProperty.update({
        pictures: merged
    }, { where: { coiffeurID: req.coiffeur.result } })


    const coiffeur = await Coiffeur.findOne({
        where: { id: req.coiffeur.result },
        include: {
            model: CoiffeurProperty
        }
    })
    return res.json(new Response(1, coiffeur, ""))

})


const deletePicture = tryCatchWrapper(async (req, res, next) => {
    const { index } = req.params


    const props = await CoiffeurProperty.findOne({ where: { coiffeurID: req.coiffeur.result } })

    let newPictures = props.pictures

    newPictures.splice(index, 1)

    console.log(newPictures);
    await CoiffeurProperty.update({
        pictures: newPictures
    }, { where: { coiffeurID: req.coiffeur.result } })


    const coiffeur = await Coiffeur.findOne({
        where: { id: req.coiffeur.result },
        include: {
            model: CoiffeurProperty
        }
    })
    return res.json(new Response(1, coiffeur, ""))


})


const getReservationTypes = tryCatchWrapper(async (req, res, next) => {


    const newType = await ReservationType.findAll({
        where: {

            coiffeurID: req.coiffeur.result
        }
    })

    return res.json(new Response(1, { types: newType }, ""))
})
const addReservationType = tryCatchWrapper(async (req, res, next) => {

    const { type, price } = req.body

    const newType = await ReservationType.create({
        type,
        price,
        coiffeurID: req.coiffeur.result
    })

    return res.json(new Response(1, newType, ""))
})

const deleteReservationType = tryCatchWrapper(async (req, res, next) => {


    const newType = await ReservationType.destroy({
        where: { id: req.params.id }
    })

    return res.json(new Response(1, null, ""))
})



const listReservations = tryCatchWrapper(async (req, res, next) => {
    const { date, isApproved } = req.body;

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Son saniyeyi doğru ayarlayın

    const reservations = await Reservation.findAll({
        where: {
            coiffeurID: req.coiffeur.result,
            status: {
                [Op.or]: ["payment_success", "waiting", "finished", "rejected"]
            },
            isApproved: isApproved,
            resDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        order: [["resDate", "DESC"]]
    });

    // ReservationType sorgularını Promise.all ile topluca çalıştırın
    const reservationss = await Promise.all(reservations.map(async (reservation) => {
        const resTypes = await Promise.all(
            reservation.resTypeIDs.map(typeID =>
                ReservationType.findOne({ where: { id: typeID } })
            )
        );

        return {
            ...reservation.toJSON(), // Reservation nesnesini düz JSON'a dönüştürün
            types: resTypes
        };
    }));

    res.json(new Response(1, { reservations: reservationss }, ""));
});


const approveReservation = tryCatchWrapper(async (req, res, next) => {
    const { resID, approve } = req.body

    const reserv2 = await Reservation.findOne({ where: { id: resID } })

    if (reserv2.status == "rejected") {
        return res.json(new Response(-1, null, "İptal edilmiş bir rezervasyonda değişiklik yapamazsın"))
    }

    const request = {
        paymentTransactionId: reserv2.paymentTransactionID,
        price: reserv2.totalPrice
    }

    const coiffeur = await Coiffeur.findOne({where: {id: req.coiffeur.result}})


    if (approve == false) {

        const result = await new Promise((resolve, reject) => {


            iyzipay.refund.create(request, async (err, ress) => {


                if (err) {

                    return next(new CustomError("Error occured in method", -2));
                } else {
                    if (ress.status === "success") {

                        await createUserNotification(reserv2.userID, "Rezervasyon reddedildi" , `${coiffeur.name} yaptığınız rezervasyonu reddetti.`)
                        await Reservation.update({ isApproved: false, status: "rejected" }, { where: { id: reserv2.id } })
                        await Payment.update({ status: "canceled" }, { where: { reservationID: reserv2.id } })
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
    }


    if (approve == true) {
        const now = newDate()
        if (now > reserv2.resDate) {
            return res.json(new Response(-1, {}, "Zamanı geçmiş rezervasyonları onaylayamazsınız"));
        }
    }

    console.log(new Date()); 
    await createUserNotification(reserv2.userID, "Rezervasyon onaylandı." , `${coiffeur.name} yaptığınız rezervasyonu onayladı.`)
    await Reservation.update({ isApproved: approve }, { where: { id: resID, resDate: { [Op.gte]: newDate() } } })

    const reserv = await Reservation.findOne({ where: { id: resID } })
    res.json(new Response(1, { reservation: reserv }, ""));
})



const setFinished = tryCatchWrapper(async (req, res, next) => {
    const { reservationID } = req.body

    const reservation = await Reservation.findOne({ where: { id: reservationID } })

    if (new Date() < new Date(reservation.resDate)) {
        return res.json(new Response(-1, null, "Saati gelmemiş rezervasyonları tamamlandı olarak işaretleyemezsin."))

    }
    if (reservation.status == "finished") {

        return res.json(new Response(-1, null, "Bu rezervasyon zaten tamamlanmış."))
    }
    if (reservation.isApproved != true) {

        return res.json(new Response(-1, null, "Onaylanmamış Rezervasyonları tamamlanmış olarak işaretleyemezsiniz."))
    }

    await createUserNotification(reservation.userID, "Rezervasyon tamamlandı." , `Rezervasyonunuz tamamlandı kuaförü değerlendirebilirsiniz.`)
    await Reservation.update({ status: "finished" }, { where: { id: reservationID } })
    res.json(new Response(1, {}, "Tamamlandı"));

})


module.exports = {
    register,
    registerToIyzico,
    login,
    updateProfile,
    addPicture,
    deletePicture,


    getReservationTypes,
    addReservationType,
    deleteReservationType,

    listReservations,
    approveReservation,
    setFinished

}