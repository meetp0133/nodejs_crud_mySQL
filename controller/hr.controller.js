const conn = require("../db/conn")
const bcrypt = require('bcryptjs');
const helper = require("../helper/helper")
const jwt = require('jsonwebtoken');
// const {hrAddValidation} = require("../validation/hr.validation")
const {SUCCESSFUL, FAILURE, META_STATUS_1, JWT_TOKEN_EXPIRE, SECRETE_KEY, SERVERERROR} = require("../config/key")

exports.register = async (req, res) => {
    try {
        let reqParam = req.body
// has hashed pw => add to database
        let sql = "select * from hr where email= '" + reqParam.email + "'"
        conn.query(
            sql,
            async (err, result) => {
                if (result.length) {
                    return helper.error(res, "Email is already exist..!!", FAILURE);
                } else {
                    let sql = "INSERT INTO hr (name, email, password) VALUES(?,?,?)"
                    let password = await bcrypt.hash(reqParam.password, 10)
                    var values = [reqParam.name, reqParam.email, password];

                    conn.query(
                        sql, values,
                        (err, result) => {
                            if (err) {
                                // throw err;
                                return helper.error(res, err.sqlMessage, FAILURE)
                            }
                            return helper.success(res, 1, "Hr added successfully..!!", SUCCESSFUL, result.affectedRows);
                        }
                    );
                }
            }
        );
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}

exports.login = (req, res) => {
    try {
        let reqParam = req.body
        let sql = "select * from hr where email = '" + reqParam.email + "'"
        conn.query(
            sql,
            (err, result) => {
                // user does not exists
                if (err) {
                    return helper.error(res, err, FAILURE);
                }
                if (!result.length) {
                    return helper.error(res, "Email or password is incorrect!", FAILURE)
                }
                // check password
                bcrypt.compare(
                    reqParam.password,
                    result[0]['password'],

                    (bErr, bResult) => {
                        // wrong password
                        if (bErr) {
                            return helper.error(res, "Email or password is incorrect!", FAILURE)

                        }
                        if (bResult) {
                            const token = jwt.sign({id: result[0].id}, SECRETE_KEY, {expiresIn: JWT_TOKEN_EXPIRE});
                            let data = {
                                name: result[0].name,
                                email: result[0].email,
                            }
                            return helper.success(res, META_STATUS_1, "Log in successfully..!!", SUCCESSFUL, data, {token})
                        }
                        return helper.error(res, "Email or password is incorrect!", FAILURE)

                    }
                );
            }
        );

    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}

exports.editHrDetails = (req, res) => {
    try {
        let reqParam = req.body
        let sql = "select * from hr where id = ? "
        conn.query(sql, [req.params.id], async (err, rows) => {
            let name, email, password, sqlQuery
            if (!err) {
                name = reqParam?.name ? reqParam.name : rows[0].name,
                    email = reqParam?.email ? reqParam.email : rows[0].email,
                    password = await bcrypt.hash(reqParam.password ? reqParam.password : rows[0].password, 10),
                    sqlQuery = "UPDATE hr SET name='" + name + "', email='" + email + "', password='" + password + "'WHERE id=" + req.params.id,
                    conn.query(sqlQuery, (err, result) => {
                        if (err) return helper.error(res, err, FAILURE);
                        return helper.success(res, META_STATUS_1, "Employee edited successfully..!!!", SUCCESSFUL, result.affectedRows)
                    })
            }
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}