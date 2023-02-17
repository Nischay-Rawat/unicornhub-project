import Joi from 'joi';
import mongoose, { Schema } from 'mongoose'
const postSchema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    total_like: {
        type: Number,
        default: 0,
        ref: 'postlike'
    },
    text: {
        type: String,
        required: true,
    },
    popular_mail_status:{
        type:Boolean,
        default:false
    }
})
const Post = new mongoose.model('posts', postSchema)
function validatePost(post) {
    const schema = Joi.object({
        user_id: Joi.string().required().min(3),
        text: Joi.string().required().min(3),

    })
    return schema.validate(post);
}
export { Post, validatePost as validate, }