const router = require('express').Router();
const controller = require('../controllers/admin');

const adminAuth = require('../middlewares/adminAuth');

router.post('/login', controller.login);

router.post("/set-approved" , controller.setApproved)


router.get("/get-pet-types", adminAuth, controller.getPetTypes)
router.post("/add-pet-types",adminAuth, controller.addPetTypes)
router.delete('/delete-pet-types', adminAuth, controller.deletePetTypes)

router.delete("/delete-user", adminAuth, controller.deleteUser)
router.get('/search-user', adminAuth, controller.searchUser)
router.get("/get-users", adminAuth, controller.getUsers)

router.post("/get-municipalities" , adminAuth,controller.getMunicipalities)
router.post("/municipalities-details", adminAuth, controller.municipalitiesDetails)
router.delete("/delete-municipality/:municipalityID" , adminAuth , controller.deleteMunicipality)


module.exports = router;