require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const { ACCESS_TOKEN_SECRET } = process.env

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({ error: "you must be log in!" });
    }

    const accessToken = authorization.replace("Bearer ", "");
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "you must be log in!" });
        }

        const { userId } = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};