const express = require("express")
const Router = express.Router()
const controller = require("../controller/accounts.controller")
const auth = require("../middalewear/auth")

Router.post("/add-account-details",controller.addAccountDetails)
Router.post("/list-account-details",auth.employeeAuth,controller.listAccountDetails)
Router.post("/edit-account-details",auth.employeeAuth,controller.editAccountDetails)
Router.post("/delete-account-details",auth.employeeAuth,controller.deleteAccountDetails)

module.exports = Router