import express from 'express';
const app = express();
import validation from './startup/validation.js';
validation()
import route from './startup/routes.js'
route(app);
import db from './startup/db.js';
db();
import config from './startup/config.js'
config();

// import validation from './startup/validation.js'
// validation();
const port = process.env.PORT || 4080;
const server = app.listen(port, () => {
    console.info(`app is listening on port no ${port}`)
})

export default server;