const express = require("express");
const router = express.Router();
const adminRouter = require('./admin');
const userRouter = require('./user');
const coiffeurRouter = require('./coiffeur');
const { City , District } = require("../models");
const path = require("path");

router.get("/", (req, res) => {
    res.send("api");
});

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/coiffeur', coiffeurRouter);


router.get("/get-cities", async (req, res) => {
    const cities = await City.findAll({
        include: [
            {
                model: District,
                as: "districts",
                attributes: ["name", "id"]
            }
        ],
        attributes: ["name", "id"]

    })
    res.json(cities);
});

router.get("/payment-success", async (req, res) => {
  
  res.sendFile(path.join(__dirname, '../views/payment_successfull.html'));
});
router.get("/payment-fail", async (req, res) => {
  
  res.sendFile(path.join(__dirname, '../views/payment_failure.html'))
});



module.exports = router;
