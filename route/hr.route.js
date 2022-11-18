const express = require('express');
const router = express.Router();
const controller = require("../controller/hr.controller")


router.post("/register",controller.register)
router.post("/login",controller.login)
router.post("/edit-hr/:id",controller.editHrDetails)

module.exports = router;