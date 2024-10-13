const router = require('express').Router();
const controller = require('../controllers/user');
const paymentController = require('../controllers/payment');
const userAuth = require('../middlewares/userAuth');
const { uploadMedia } = require('../middlewares/uploadMedia');


router.post('/register',uploadMedia("profilePicture"), controller.register);
router.post('/login', controller.login);

module.exports = router;