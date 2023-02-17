import mongoose, { Schema } from 'mongoose'
import Joi from 'joi';
const postLikeSchema = new mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

})
function validatePostLike(postLike) {

    const schema = Joi.object({
        user_id: Joi.myJoiObjectId().required(),
        post_id: Joi.myJoiObjectId().required(),

    })
    return schema.validate(postLike)
}
const PostLike = new mongoose.model('postlikes', postLikeSchema)

export { PostLike, validatePostLike }