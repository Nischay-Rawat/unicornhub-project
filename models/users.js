import Joi from 'joi';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from 'config'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
})
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
    return token;

}
const User = new mongoose.model('users', userSchema)
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        email: Joi.string().required().min(3),
        password: Joi.string().min(3).required(),

    })
    return schema.validate(user);
}
export { User, validateUser as validate, }