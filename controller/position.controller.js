const conn = require("../db/conn")
const helper = require("../helper/helper")
const {SERVERERROR, SUCCESSFUL, FAILURE, META_STATUS_1} = require("../config/key")

exports.listPosition = (req, res) => {
    try {
        let reqParam = req.body
        let sortBy = reqParam?.sortBy ? reqParam.sortBy : "employee_id"
        let limit = reqParam?.limit ? reqParam.limit : 5
        let page = reqParam?.page ? reqParam.page * limit : 0
        let search = reqParam?.search ? reqParam.search : ""
        let searchIn = reqParam?.searchIn ? reqParam.searchIn : "position"
        let sortKey = reqParam?.sortKey ? reqParam.sortKey : "asc"
        conn.query("select * from position WHERE " + searchIn + " LIKE '%" + search + "%' ORDER BY " + sortBy + " " + sortKey + " limit " + limit + "  offset " + page + "", (err, rows) => {
            if (err) {
                return helper.error(res, err, FAILURE)
            } else {
                return helper.success(res, 1, "Position listed successfully", SUCCESSFUL, rows)
                // res.status(200).send({"Position listed successfully: ": rows})
            }
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}

exports.addPosition = async (req, res) => {
    try {
        let reqParam = req.body
        const sql = "INSERT INTO `position`(`position`, `employee_id`) VALUES (?,?)";
        var values = [reqParam.position, reqParam.employee_id];
        await conn.query(sql, values, function (err, results) {
            if (err) return helper.error(res, err, FAILURE)
            return helper.success(res, META_STATUS_1, "Number of records inserted", SUCCESSFUL, results.affectedRows)
            // res.status(200).send({"Number of records inserted: ": results.affectedRows})
            // console.log("Number of records inserted: " + result.affectedRows);
        });
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)
    }
}

exports.editPosition = (req, res) => {
    try {
        const reqParam = req.body
        conn.query('SELECT * FROM position WHERE id = ?', [req.params.id], (err, rows, fields) => {
            let position, employee_id, sqlQuery
            if (!err)
                position = reqParam?.position ? reqParam.position : rows[0].position,
                    employee_id = reqParam?.employee_id ? reqParam.employee_id : rows[0].employee_id,
                    sqlQuery = "UPDATE position SET position='" + position + "', employee_id='" + employee_id + "'WHERE id=" + req.params.id,
                    conn.query(sqlQuery, (err, results) => {
                        if (err) return helper.error(res, err, FAILURE)
                        return helper.success(res, META_STATUS_1, "Position edited successfully", SUCCESSFUL, results.affectedRows)
                        // res.status(200).send({"Position edited successfully": results.affectedRows});
                    })
            else
                console.log(err);
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }

};

exports.deletePosition = (req, res) => {
    try {
        let sqlQuery = "DELETE FROM position WHERE id = ?"
        conn.query(sqlQuery, [req.params.id], (error, results, fields) => {
            if (error) return helper.error(res, error.message, FAILURE)
            return helper.success(res, META_STATUS_1, "Deleted Employee successfully", SUCCESSFUL, results.affectedRows)
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)
    }
}

exports.groupByPosition = (req, res) => {
    try {    // const sql = "SELECT COUNT(id), position FROM position GROUP BY position;"
        // const sql = "SELECT COUNT(position.id), position FROM position left join employee on employee.employee_id=position.employee_id  GROUP BY position.position;"
        const sql = "select COUNT(position.id),position from employee right join position on employee.employee_id=position.employee_id GROUP BY position.position;"
        conn.query(sql, function (err, results) {
            if (err) return helper.error(res, err, FAILURE)
            return helper.success(res, META_STATUS_1, "Employee details listed", SUCCESSFUL, results)
            // res.status(200).send({'Employee details listed ': results});
            /*console.log(result);*/
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)
    }
}

exports.editEmployeeDetails = (req, res) => {
    try {
        let reqParam = req.body
        let sql = "select * from position inner join employee on employee.employee_id = position.employee_id where position.employee_id = ? ;"
        conn.query(sql, [reqParam.employee_id], (err, rows) => {
            let name, email, position, phone, sqlQuery
            if (!err) {
                position = reqParam?.position ? reqParam.position : rows[0].position,
                    name = reqParam?.name ? reqParam.name : rows[0].name,
                    email = reqParam?.email ? reqParam.email : rows[0].email,
                    phone = reqParam?.phone ? reqParam.phone : rows[0].phone,
                    sqlQuery = "update position inner join employee on position.employee_id=employee.employee_id set " +
                        "employee.name='" + name + "' ,employee.email='" + email + "' ,employee.phone='" + phone + "' ," +
                        "position.position='" + position + "' where employee.employee_id = ?"
                conn.query(sqlQuery, [req.body.employee_id], function (err, result) {
                    if (err) return helper.error(res, err, FAILURE)
                    return helper.success(res, META_STATUS_1, "Number of records inserted", SUCCESSFUL, result.affectedRows)
                    // res.status(200).send({"Number of records inserted: ": result})
                    // console.log("Number of records inserted: " + result.affectedRows);
                });
            }
        })
    } catch (e) {
        return helper.error(res, "Something wrong..!!", SERVERERROR)

    }
}