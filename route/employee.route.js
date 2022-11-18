const express = require("express")
const Router = express.Router();
const controller = require("../controller/employee.controller")
const {hrAuth,employeeAuth} = require("../middalewear/auth")

Router.post("/list",hrAuth,controller.listEmployee)

Router.post('/employee',employeeAuth,controller.viewEmployee);

Router.post("/create",hrAuth, controller.addEmployee)

Router.post('/update/:id',employeeAuth, controller.editEmployee);

Router.post("/delete/:id",hrAuth,controller.deleteEmployee)

Router.post("/employee-login",controller.employeelogin)


module.exports = Router