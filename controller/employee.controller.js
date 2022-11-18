const conn = require("../db/conn")
const helper = require("../helper/helper")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SUCCESSFUL, FAILURE, SERVERERROR, META_STATUS_1, META_STATUS_0, JWT_TOKEN_EXPIRE, SECRETE_KEY} = require("../config/key")


exports.listEmployee = (req, res) => {
    try {
        let reqParam = req.body
        let sortBy = reqParam?.sortBy ? reqParam.sortBy : "employee_id"
        let limit = reqParam?.limit ? reqParam.limit : 5
        let skip = reqParam?.skip ? reqParam.skip * limit : 0
        let search = reqParam?.search ? reqParam.search : ""
        let searchIn = reqParam?.searchIn ? reqParam.searchIn : "name"
        let sortKey = reqParam?.sortKey ? reqParam.sortKey : "asc"

        conn.query("select * from employee  WHERE " + searchIn + " LIKE '%" + search + "%' ORDER BY " + sortBy + " " + sortKey + " limit " + limit + "  offset " + skip + "  ", (err, rows, fields) => {
            if (err) {
                return helper.error(res, err, FAILURE)
                s
            } else {
                return helper.success(res, META_STATUS_1, "Employee listed successfully..!!", SUCCESSFUL, rows)
            }
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)
    }
};

// exports.viewEmployee = (req, res) => {
//     conn.query('SELECT * FROM employee WHERE id = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.status(200).send({"Employee profile: ": rows[0]});
//         else
//             console.log(err);
//     })
// };

exports.viewEmployee = (req, res) => {
    try {
        // const sql = "select * from employee inner join position on employee.employee_id=position.employee_id where employee.id = ? "
        const sql = "select * from employee inner join position on employee.employee_id=position.employee_id " +
            "inner join address on employee.employee_id = address.employee_id " +
            "inner join account on employee.employee_id = account.employee_id where employee.id = ? "


        conn.query(sql, [req.employee.id], function (err, results) {
            if (err) return helper.error(res, err, FAILURE);
            results = results[0]
            const obj = {
                Employee_details:{
                    Employee_id: results.employee_id,
                    Employee_name: results.name,
                    Employee_email: results.email,
                    Employee_phone: results.phone,
                    Employee_salary: results.salary,
                    Address:{
                        line1: results.address,
                        landmark: results.landmark,
                        district: results.district,
                        state: results.state,
                        country: results.country,
                        pincode: results.pincode,
                    },
                    Account_Details:{
                        Bank_Name: results.bank_name,
                        AC_No: results.AC_No,
                        IFSC: results.IFSC
                    }
                },

            }
            return helper.success(res, 1, 'Employee details listed..!!', SUCCESSFUL, obj)
            /*console.log(result);*/
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}

exports.addEmployee = async (req, res) => {
    try {
        let sql = "select * from employee where email = ?"
        conn.query(sql, [req.body.email], async (err, result) => {
            if (result.length) {
                return helper.error(res, "Email is already exist..!!", FAILURE);
            } else {
                let reqParam = req.body
                let password = await bcrypt.hash(reqParam.password, 10)
                const sql = "INSERT INTO employee (name, email, phone,employee_id,password) VALUES(?,?,?,?,?)";
                var values = [reqParam.name, reqParam.email, reqParam.phone, reqParam.employee_id, password];
                await conn.query(sql, values, function (err, result) {
                    if (err) return helper.error(res, err, FAILURE);
                    return helper.success(res, META_STATUS_1, "Number of records inserted", SUCCESSFUL, result.affectedRows)
                });
            }
        })

    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
};

exports.editEmployee = (req, res) => {
    try {
        const reqParam = req.body
        conn.query('SELECT * FROM employee WHERE id = ?', [req.params.id], async (err, rows, fields) => {
            let name, email, phone, employee_id, sqlQuery, password
            if (err) return helper.error(res, "Employee Not found..!!")
            else (rows.length)
            name = reqParam?.name ? reqParam.name : rows[0].name,
                email = reqParam?.email ? reqParam.email : rows[0].email,
                phone = reqParam?.phone ? reqParam.phone : rows[0].phone,
                password = await bcrypt.hash(reqParam.password ? reqParam.password : rows[0].password, 10),
                employee_id = reqParam?.employee_id ? reqParam.employee_id : rows[0].employee_id,
                sqlQuery = "UPDATE employee SET name='" + name + "', email='" + email + "', phone='" + phone + "', employee_id='" + employee_id + "', password='" + password + "'WHERE id=" + req.params.id,
                conn.query(sqlQuery, (err, result) => {
                    if (err) return helper.error(res, err, FAILURE);
                    return helper.success(res, META_STATUS_1, "Employee edited successfully..!!!", SUCCESSFUL, result.affectedRows)
                })
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }

};

exports.deleteEmployee = (req, res) => {
    try {
        let sqlQuery = "DELETE FROM employee WHERE id = ?"
        conn.query(sqlQuery, [req.params.id], (err, results, fields) => {
            if (err) return helper.error(res, err, FAILURE);
            return helper.success(res, META_STATUS_1, "Deleted Employee successfully", SUCCESSFUL, results.affectedRows)
            // res.status(200).send({'Deleted Employee successfully': results.affectedRows});
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}


exports.employeelogin = (req, res) => {
    try {
        let reqParam = req.body
        let sql = "select * from employee where email = '" + reqParam.email + "'"
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
                                employee_id: result[0].employee_id,
                                phone: result[0].phone,
                            }
                            return helper.success(res, 1, "Log in successfully..!!", SUCCESSFUL, data, {token})
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

