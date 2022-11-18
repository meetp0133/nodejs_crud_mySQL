const mysql = require("mysql")

const mysqlConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Pass@123",
    database:"company"
})

mysqlConnection.connect((err)=>{
    if(err){
        console.log(err)
        console.log("Connection Failed")
    }
    else{
        console.log("connected successfully..!!")
    }
})

module.exports = mysqlConnection