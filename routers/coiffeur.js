const router = require('express').Router();
const controller = require('../controllers/coiffeur');

const coiffeurAuth = require('../middlewares/coiffeurAuth');
const { uploadMultipleMedia } = require('../middlewares/uploadMedia');


router.post("/register", controller.register)
router.post("/register-to-iyzico", coiffeurAuth, controller.register)
router.post("/login", controller.login)

router.post("/update-profile",uploadMultipleMedia({name: "pictures", count:5}), coiffeurAuth,controller.updateProfile)

router.post("/add-pictures" , uploadMultipleMedia({name: "pictures", count:5}) , coiffeurAuth , controller.addPicture)
router.delete("/delete-picture/:index" , coiffeurAuth, controller.deletePicture )


router.get("/get-reservation-types" , coiffeurAuth, controller.getReservationTypes)
router.post("/create-reservation-type" , coiffeurAuth ,controller.addReservationType)
router.delete("/delete-reservation-type/:id" , coiffeurAuth , controller.deleteReservationType)

module.exports = router;