import express from 'express'
import bcrypt from 'bcrypt'
import { User, validate } from '../models/users.js'
import _ from 'lodash'
import auth from '../middleware/auth.js'
const router = express.Router();



//getting all user :return array
router.get('/', async (req, res) => {
    const user = await User.find({}, { email: 1, name: 1, _id: 1 }).sort();
    res.send(user);
})
//creating user and storing hash password in database 
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message)
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered");
    user = new User(_.pick(req.body, ['email', 'name', 'password',]))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.json({ token, ..._.pick(user, ['email', 'name']) })

})



export default router;