const express = require("express")
const Router = express.Router()
const controller = require("../controller/address.controller")
const auth = require("../middalewear/auth")

Router.post("/add-address",controller.addAddress)
Router.post("/list-address",auth.employeeAuth,controller.listAddress)
Router.post("/edit-address",auth.employeeAuth,controller.editAddress)
Router.post("/delete-address",auth.employeeAuth,controller.deleteAddress)

module.exports = Router