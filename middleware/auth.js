import jwt from 'jsonwebtoken'
import config from 'config';
function ValidateSignature(req) {
    try {
        const signature = req.get("Authorization");
        const APP_SECRET = config.get('jwtPrivateKey')

        const payload = jwt.verify(signature.split(" ")[1], APP_SECRET);
        req.user = payload;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export default (req, res, next) => {

    const isAuthorized = ValidateSignature(req);

    if (isAuthorized) {
        return next();
    }
    return res.status(403).json({ message: 'Not Authorized' })
}