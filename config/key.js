require("dotenv").config()

module.exports = {
    SERVERERROR:500,
    META_STATUS_0:0,
    META_STATUS_1:1,
    SUCCESSFUL:200,
    EXITING:200,
    FAILURE:400,
    DELETED:3,
    ACTIVE:1,
    DEACTIVATE:2,
    PORT:process.env.PORT,
    JWT_TOKEN_EXPIRE  : process.env.JWT_TOKEN_EXPIRE,
    SECRETE_KEY : process.env.SECRETE_KEY,
}