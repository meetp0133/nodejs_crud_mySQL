const Joi = require("joi")
const helper = require("../helper/helper")
module.exports = {
    async hrAddValidation(req) {
        const schema = Joi.object({
            name: Joi.string().min(3).max(25).trim(true),
            email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).trim(true),
            password: Joi.string().min(5),
        }).unknown(true);
        const {error} = schema.validate(req);
        if (error) {
            return helper.validationMessageKey("validation", error);
        }
        return null;
    }
}