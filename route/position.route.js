const express = require("express")
const Router = express.Router();
const controller = require("../controller/position.controller")
const {hrAuth} = require("../middalewear/auth")

Router.post("/list-position",hrAuth,controller.listPosition )

Router.post("/add-position",hrAuth,controller.addPosition)

Router.post("/group-employee",hrAuth,controller.groupByPosition)

Router.post("/edit-position/:id",hrAuth,controller.editPosition)

Router.post("/position/:id",hrAuth,controller.deletePosition)

Router.post("/update-details",hrAuth,controller.editEmployeeDetails)

module.exports = Router