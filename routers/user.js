const router = require('express').Router();
const controller = require('../controllers/user');
const paymentController = require('../controllers/payment');
const userAuth = require('../middlewares/userAuth');
const { uploadMedia } = require('../middlewares/uploadMedia');


router.post('/register',uploadMedia("profilePicture"), controller.register);
router.post('/login', controller.login);

router.post("/create-reservation" , userAuth , controller.createReservation)

router.post("/finish-payment" , controller.finishPayment)

router.post("/list-reservations" , userAuth , controller.listReservations)

router.post("/search-coiffeurs" , controller.searchCoiffeur)

router.post("/cancel-reservation", userAuth , controller.cancelReservation)


module.exports = router;