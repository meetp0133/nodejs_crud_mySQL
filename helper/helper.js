exports.success = (res, status, message, statusCode, data = null, extra) => {
    let response = "";

    response = {

        meta: {
            status: status,
            message: message,
            ...extra
        },
        data: data,
        statusCode: statusCode
    }

    return res.send(response);
}


exports.error = (res, message, statusCode) => {

    let response ;
    response = {
        message: message,
        statusCode: statusCode
    }
    return res.status(statusCode).send(response);
}

capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.validationMessageKey = (apikey, error) => {
    let type = error.details[0].type
    let key = error.details[0].context.key
    type = type.split(".")
    type = capitalizeFirstLetter(type[1])
    type = (type == "Empty") ? "Required" : type
    key = capitalizeFirstLetter(key)
    const result = apikey + type + key
    return result
}
