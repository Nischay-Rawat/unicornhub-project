import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/users.js'
import _ from 'lodash'
import Joi from 'joi'

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message)
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Invalid email or password");
    const token = user.generateAuthToken();

    res.send(token);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error)
        return res.status(400).send(error.message)

    let user = await User.findByIdAndUpdate((req.params.id), { name: req.body.name, email: req.body.email, password: req.body.password })

    if (!user)
        return res.status(404).send("No matching id number");


    res.send(user);


})
router.delete('/:id', async (req, res) => {

    const user = await User.findByIdAndDelete((req.params.id))

    if (!user) return res.status(404).send("No matching id number")
    res.send(user)



})
function validate(user) {
    const schema = Joi.object({
        email: Joi.string().required().min(3),
        password: Joi.string().min(3).required()

    })
    return schema.validate(user);
}


export default router;