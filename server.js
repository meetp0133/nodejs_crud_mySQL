const express = require("express")
require("./db/conn")
const port = 5000
const app = express();
app.use(express.json());

const employee = require("./route/employee.route")
app.use(employee)

const position = require("./route/position.route")
app.use(position)

const address = require("./route/address.route")
app.use(address)

const account = require("./route/account.route")
app.use(account)

const hr = require("./route/hr.route")
app.use(hr)
app.listen(port,()=>{
    console.log(`connected to server successfully:${port}`)
})