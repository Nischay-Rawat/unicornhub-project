import express from 'express'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import auth from '../middleware/auth.js'
import { Post, validate } from '../models/posts.js'
import { PostLike, validatePostLike } from '../models/postlikes.js'
import { User } from '../models/users.js'
import { sendmail } from '../utils/mail.js'
const router = express.Router();



//getting all posts :return array
router.get('/', auth, async (req, res) => {
    const post = await Post.find().sort();
    res.send(post);
})
//creating Post and putting user_id in database. the relation should be one to many user to posts 
router.post('/', [auth], async (req, res) => {
    try {
        console.log(req.body)
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.message)
        let post = new Post(_.pick(req.body, ['text', 'user_id']))
        post = await post.save();

        return res.json(post);
    } catch (ex) {
        res.status(500).send("Something went wrong")
    }

})
router.post('/like', [auth], async (req, res) => {
    try {
        const { error } = validatePostLike(req.body);
        if (error) return res.status(400).send(error.message)
        const { user_id, post_id, status } = req.body
        let post = await Post.findOne({ _id: post_id });
        const user = await User.findOne({ _id: user_id })
        if (!post || !user) {
            return res.status(500).send("Something went wrong")
        }
        let total_like = post.total_like
        let postLike = await PostLike.findOne(_.pick(req.body, ['user_id', 'post_id']))
        if (postLike) {
            return res.json({ message: "Already Liked", status: 0 })
        }
        postLike = new PostLike({ user_id, post_id, status })
        postLike = await postLike.save();;
        const total = total_like + 1
        post = await Post.findOneAndUpdate({ _id: post._id }, { $set: { total_like: total } }, { new: true })

        const userTopLikedPost = await Post.findOne({ user_id: user_id, total_like: { $gt: total } }).sort({ total_like: -1 })
        if (!userTopLikedPost && (!post.popular_mail_status)) {
            sendmail()
            await Post.updateOne({ _id: post._id }, { $set: { popular_mail_status: true } })
        }
        return res.json("Post Liked Successfully");
    } catch (ex) {
        res.status(500).send("Something went wrong")
    }

})
router.post('/dislike', [auth], async (req, res) => {
    try {
        const { error } = validatePostLike(req.body);
        if (error) return res.status(400).send(error.message)
        const { user_id, post_id, status } = req.body
        const post = await Post.findOne({ _id: post_id });
        const user = await User.findOne({ _id: user_id })
        if (!post || !user) {
            return res.status(500).send("Something went wrong")
        }
        let total_like = post.total_like
        let postLike = await PostLike.findOne(_.pick(req.body, ['user_id', 'post_id']))
        if (postLike) {
            await PostLike.deleteOne({ _id: postLike })
            await Post.updateOne({ _id: post._id }, { $set: { total_like: total_like - 1 } })
            return res.send("Post Disliked Successfully");
        } else {
            return res.send("No Action Performed")
        }


    } catch (ex) {
        res.status(500).send("Something went wrong")
    }

})
router.get('/trending', async (req, res) => {
    const trendingPost = await Post.find().sort({ total_like: -1 }).limit(10);
    res.send(trendingPost)

})
router.get('/:id', auth, async (req, res) => {
    const post = await Post.findById(req.params.id).sort();
    res.send(post);
})



export default router;