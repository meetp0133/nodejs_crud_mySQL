const jwt = require('jsonwebtoken');
const db = require('../db/conn');
const {FAILURE,SERVERERROR,SECRETE_KEY} = require("../config/key")
const helper = require("../helper/helper")

exports.hrAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        let decode = await jwt.verify(token,SECRETE_KEY );
        if (!decode) {
            return helper.error(res,"Token Expired..!!",FAILURE)
        }
        const hr = db.query('SELECT * FROM hr where id=?', decode.id, async (error, results) => {
            if (error) return helper.error(res,"Hr not found..!!",FAILURE)
            req.hr = decode
            await next();
        });
    } catch (e) {
        return helper.error(res,"Token Expired..!!",SERVERERROR)
    }

};
exports.employeeAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        let decode = await jwt.verify(token,SECRETE_KEY );
        if (!decode) {
            return helper.error(res,"Token Expired..!!",FAILURE)
        }
        const employee = db.query('SELECT * FROM employee where id=?', decode.id, async (error, results) => {
            if (error) return helper.error(res,"Employee Not Found..!!",FAILURE)
            req.employee = decode
            await next();
        });
    } catch (e) {
        return helper.error(res,"Token Expired..!!",SERVERERROR)
    }

};
