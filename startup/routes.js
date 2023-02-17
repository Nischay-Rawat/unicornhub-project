import express from 'express';
import users from "../route/users.js"
import auth from "../route/auth.js"
import posts from "../route/posts.js"
export default function (app) {
    app.use(express.json());
    app.use('/api/users', users)
    app.use('/api/posts', posts)
    app.use('/api/auth', auth);
    app.use((req, res) => {
        return res.status(500).send("something failed")
    });
}