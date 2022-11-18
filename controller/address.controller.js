const conn = require("../db/conn")
const helper = require("../helper/helper")
const {SUCCESSFUL, FAILURE, SERVERERROR, META_STATUS_1, META_STATUS_0, JWT_TOKEN_EXPIRE, SECRETE_KEY} = require("../config/key")

exports.listAddress = (req, res) => {
    try {
        let sql = "select * from address inner join employee on employee.employee_id=address.employee_id where employee.id = ? "
        conn.query(sql, [req.employee.id], (err, result) => {
            if (err) return helper.error(res, err, FAILURE)
            else {
                let obj = {
                    employee_id: result[0].employee_id,
                    line1: result[0].address,
                    landmark: result[0].landmark,
                    district: result[0].district,
                    state: result[0].state,
                    country: result[0].country,
                    pincode: result[0].pincode,
                }
                return helper.success(res, META_STATUS_1, "Address listed successfully..!!", SUCCESSFUL, obj
                )
            }
        })
    } catch (e) {

    }
}

exports.addAddress = async (req, res) => {
    try {
        let reqParam = req.body
        const sql = "INSERT INTO address (address, landmark,district,state,country,pincode,employee_id) VALUES(?,?,?,?,?,?,?)";
        var values = [ reqParam.address, reqParam.landmark, reqParam.district,  reqParam.state, reqParam.country, reqParam.pincode,reqParam.employee_id];
        await conn.query(sql, values, function (err, result) {
            if (err) return helper.error(res, err.sqlMessage, FAILURE);
            return helper.success(res, META_STATUS_1, "Number of records inserted", SUCCESSFUL, result.affectedRows)
        });
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
};

exports.editAddress = (req, res) => {
    try{
        const reqParam = req.body
        let sql = "select * from address inner join employee on employee.employee_id=address.employee_id where employee.id = ? "
        conn.query(sql, [req.employee.id], async (err, rows, fields) => {
            let address, landmark, district, state, sqlQuery, country ,pincode ,employee_id
            if(err) return helper.error(res,"address Not found..!!")
            else (!err)
            address = reqParam?.address ? reqParam.address : rows[0].address,
                landmark = reqParam?.landmark ? reqParam.landmark : rows[0].landmark,
                district = reqParam?.district ? reqParam.district : rows[0].district,
                state = reqParam.state ? reqParam.state : rows[0].state,
                country = reqParam.country ? reqParam.country : rows[0].country,
                pincode = reqParam.pincode ? reqParam.pincode : rows[0].pincode,
                employee_id = reqParam?.employee_id ? reqParam.employee_id : rows[0].employee_id,
                sqlQuery = "UPDATE address inner join employee on employee.employee_id=address.employee_id SET address='" + address + "', landmark='" + landmark + "', district='" + district + "', " +
                    "state='" + state + "', country='" + country + "', pincode='" + pincode + "', address.employee_id='" + employee_id + "' WHERE employee.id= ?" ;
                conn.query(sqlQuery,  [req.employee.id],(err, result) => {
                    if (err) return helper.error(res, err, FAILURE);
                    return helper.success(res, META_STATUS_1, "Address edited successfully..!!!", SUCCESSFUL, result.affectedRows)
                })
        })
    }catch (e) {
        return helper.error(res,"Something wrong..!!",SERVERERROR)

    }

};

exports.deleteAddress = (req, res) => {
    try{
        let sqlQuery = "DELETE address FROM address inner join employee on employee.employee_id=address.employee_id WHERE employee.id = ?"
        conn.query(sqlQuery, [req.employee.id], (err, results, fields) => {
            if (err) return helper.error(res, err, FAILURE);
            return helper.success(res, META_STATUS_1, "Deleted Address successfully", SUCCESSFUL, results.affectedRows)
            // res.status(200).send({'Deleted Employee successfully': results.affectedRows});
        })
    }catch (e) {
        return helper.error(res,"Something wrong..!!",SERVERERROR)

    }
}
