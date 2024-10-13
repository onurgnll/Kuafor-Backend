const Iyzipay = require('iyzipay');
const CustomError = require('../errors/CustomError');

const { v4: uuidv4 } = require('uuid');
const { Municipality,NotificationMunicipality, City, Order, OrderAdoption, Shelter, PetAdoption, Feeding, Pet, User } = require("../models");
const { where } = require('sequelize');


const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_IYZIPAY_URI
});



const startPayment = async (req, res, next) => {
  try {

    const { petID,price, type, cardHolderName, cardNumber, expireMonth, expireYear, cvc, tc, address } = req.body


    const pet = await Pet.findOne({
      where: {
        id: petID
      },
      include: {
        model: Shelter,
        as: "shelter"
      }
    })

    if (!pet) return next(new CustomError("Bu idde pet bulunamadı", -1))

    const munic = await Municipality.findOne({
      where: {
        id: pet.shelter.municipalityID
      }
    })

    const user = await User.findOne({
      where: {
        id: req.user.result
      }
    })

    let conversationId = req.user?.result + '_' + uuidv4() + "_" + type;

    let createdOrder;
    if (type == "feeding") {

      createdOrder = await Order.create({
        userID: user.id,
        receiverAddress: address.address,
        receiverCountry: address.country,
        receiverCity: address.city,
        receiverDistrict: address.district,
        orderStatus: 'started',
        petID: petID,
        price: price,
        municipalityID: munic.id,
        type: type
      })
    } else {

      createdOrder = await OrderAdoption.create({
        userID: user.id,
        receiverAddress: address.address,
        receiverCountry: address.country,
        receiverCity: address.city,
        receiverDistrict: address.district,
        orderStatus: 'started',
        petID: petID,
        price: price,
        municipalityID: munic.id,
        type: type
      })
    }
    const request = {
      locale: 'tr',
      conversationId: conversationId,         // üye işyerinin sipariş numarası
      price: price,
      paidPrice: price,
      currency: 'TRY',
      installment: '1',           // taksit!!
      callbackUrl: process.env.FINISH_PAYMENT_URL,
      paymentCard: {
        cardHolderName: cardHolderName,
        cardNumber: cardNumber,
        expireMonth: expireMonth,
        expireYear: expireYear,
        cvc: cvc,
        registerCard: '0'
      },
      buyer: {
        id: `BY${req.user?.result}`,
        name: user.name,
        surname: user.surname,
        identityNumber: tc,
        city: address.city,               // ?
        country: address.country,
        email: user.email,
        ip: 'localhost',                 // server ip
        registrationAddress: address.address
      },
      billingAddress: {
        contactName: `${user.name} ${user.surname}`,
        city: address.city,
        country: address.country,
        address: address.address
      },
      basketItems: [
        {
          id: createdOrder.id + "_" + (type == "feeding" ? "feeding" : "adoption"),               // siparişe ait id
          itemType: 'VIRTUAL',
          name: `${user.name}_${user.surname}__odeme`,
          category1: 'Reklam',
          price: price,
          subMerchantKey: munic.subMerchantKey,
          subMerchantPrice: price
        }
      ]
    };
    const result = await new Promise((resolve, reject) => {
      iyzipay.threedsInitialize.create(request, async (err, result) => {


        if (err) {

          return next(new CustomError("Error occured in threedsInitialize method", -2));
        } else {
          if (result.status === "success") {
            if (result.conversationId == conversationId) {

              if (type == "feeding") {

                await Order.update({ conversationId }, { where: { id: createdOrder.id } })
              }else{
                await OrderAdoption.update({ conversationId }, { where: { id: createdOrder.id } })
              }
              const buffered = Buffer.from(result.threeDSHtmlContent, 'base64').toString("utf8");       // base64 to utf-8
              return res.json({
                success: 1,
                data: [{ Result: result, Buffered: buffered }],
                mesage: ""
              })
            }
          } else {


            return res.json({
              success: -parseInt(result.errorCode),
              data: [],
              message: result.errorMessage
            })
          }
        }
      });
    });

    res.send("ok")
  } catch (error) {
    console.error(error);
    next(new CustomError(error?.message));
  }
}

const finishPayment = async (req, res, next) => {
  try {
    let { paymentId, conversationId } = req.body;

    console.log(req);
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
            console.log(result);
            if (result.status === 'success') {

              const orderID = result.itemTransactions[0].itemId.split("_")[0];

              const orderType = result.itemTransactions[0].itemId.split("_")[1]

              let findOrder;

              if(orderType == "feeding") {

                findOrder = await Order.findOne({ where: { id: orderID } , include: {model: Municipality , as: "municipality"} });
              }else{
                findOrder = await OrderAdoption.findOne({ where: { id: orderID } , include: {model: Municipality , as: "municipality"}});

              }

              const extractedUserId = result.conversationId.split('_')[0];

              const user = await User.findOne({ where: { id: extractedUserId } });

              if (!user) return res.redirect(`${process.env.CLIENT_URL}/basarisiz`);

              if(orderType == "feeding") {

                await Order.update({ orderStatus: "success" }, { where: { id: findOrder.id } })
              }else{
                await OrderAdoption.update({ orderStatus: "success" }, { where: { id: findOrder.id } })

              }


              if (findOrder.type == "feeding") {


                const feeding = await Feeding.create({
                  userID: user.id,
                  petID: findOrder.petID,
                  municipalityID: findOrder.municipality.id,
                  status: "started"
                })

                await NotificationMunicipality.create({
                  
                  municipalityID: findOrder.municipality.id,
                  title: "Besleme satın alımı",
                  content: `${user.name} ${user.surname}  isimli hayvan için beslenme satın aldı beslemeleri kontrol et.`
                })



              }



              if (findOrder.type == "adoption") {

                const adoption = await PetAdoption.create({
                  userID: user.id,
                  petID: findOrder.petID,
                  municipalityID: findOrder.municipality.id,
                  status: "started"
                })

                await Pet.update({adoption: false} , {where: {id: findOrder.petID}})

                await NotificationMunicipality.create({
                  
                  municipalityID: findOrder.municipality.id,
                  title: "Sahiplendirme Başvurusu",
                  content: `${user.name} ${user.surname}  isimli hayvan için sahiplenme başvurusunda bulundu sahiplendirmeleri kontrol et.`
                })


              }


              //ödeme subLtdye aktarılsın
              await new Promise((resolve, reject) => {
                iyzipay.approval.create({
                  locale: Iyzipay.LOCALE.TR,
                  conversationId: uuidv4(),
                  paymentTransactionId: result.itemTransactions[0].paymentTransactionId,
                }, (err, result) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    console.log(result);
                    resolve(result);
                  }
                });
              });
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
};




module.exports = {
  startPayment,
  finishPayment
}