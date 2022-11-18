const conn = require("../db/conn")
const helper = require("../helper/helper")
const {SUCCESSFUL, FAILURE, SERVERERROR, META_STATUS_1, META_STATUS_0, JWT_TOKEN_EXPIRE, SECRETE_KEY} = require("../config/key")

exports.listAccountDetails = (req, res) => {
    try {
        let sql = "select * from account inner join employee on employee.employee_id=account.employee_id where employee.id = ? "
        conn.query(sql, [req.employee.id], (err, result) => {
            if (err) return helper.error(res, err, FAILURE)
            else {
                let obj = {
                    employee_id: result[0].employee_id,
                    employee_name: result[0].name,
                    employee_email: result[0].email,
                    Bank_Name: result[0].bank_name,
                    AC_No: result[0].AC_No,
                    IFSC: result[0].IFSC,
                    createdAt: result[0].createdAt
                }
                return helper.success(res, META_STATUS_1, "Account details listed successfully..!!", SUCCESSFUL, obj
                )
            }
        })
    } catch (e) {

    }
}

exports.addAccountDetails = async (req, res) => {
    try {
        let reqParam = req.body
        const sql = "INSERT INTO account (employee_id,AC_No) VALUES(?,?)";
        var values = [reqParam.employee_id, reqParam.AC_No];
        await conn.query(sql, values, function (err, result) {
            if (err) return helper.error(res, err.sqlMessage, FAILURE);
            return helper.success(res, META_STATUS_1, "Number of records inserted", SUCCESSFUL, result.affectedRows)
        });
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
};

exports.editAccountDetails = (req, res) => {
    try {
        const reqParam = req.body
        let sql = "select * from account inner join employee on employee.employee_id=account.employee_id where employee.id = ? "
        conn.query(sql, [req.employee.id], async (err, rows, fields) => {
            let AC_No, sqlQuery, employee_id ,bank_name ,IFSC
            if (err) return helper.error(res, "address Not found..!!")
            else (!err)
                employee_id = reqParam?.employee_id ? reqParam.employee_id : rows[0].employee_id,
                bank_name = reqParam?.bank_name ? reqParam.bank_name : rows[0].bank_name,
                IFSC = reqParam?.IFSC ? reqParam.IFSC : rows[0].IFSC,
                AC_No = reqParam?.AC_No ? reqParam.AC_No : rows[0].AC_No,
                sqlQuery = "UPDATE account inner join employee on employee.employee_id=account.employee_id SET " +
                    "account.employee_id='" + employee_id + "' ,account.bank_name='" + bank_name + "' , account.AC_No='" + AC_No + "'" +
                    ",account.IFSC='" + IFSC + "' WHERE employee.id= ?";
                conn.query(sqlQuery, [req.employee.id], (err, result) => {
                if (err) return helper.error(res, err, FAILURE);
                return helper.success(res, META_STATUS_1, "Account edited successfully..!!!", SUCCESSFUL, result.affectedRows)
            })
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }

};

exports.deleteAccountDetails = (req, res) => {
    try {
        let sqlQuery = "DELETE account FROM account inner join employee on employee.employee_id=account.employee_id WHERE employee.id = ?"
        conn.query(sqlQuery, [req.employee.id], (err, results, fields) => {
            if (err) return helper.error(res, err, FAILURE);
            return helper.success(res, META_STATUS_1, "Deleted Account successfully", SUCCESSFUL, results.affectedRows)
            // res.status(200).send({'Deleted Employee successfully': results.affectedRows});
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}