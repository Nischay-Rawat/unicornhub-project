import mongoose from 'mongoose';
import config from 'config'
export default function () {
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.info(`Connected to ${db}`))



}
