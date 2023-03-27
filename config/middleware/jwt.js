const jwt = require('jsonwebtoken');
require("dotenv").config();
const redis = require("redis");
const client = redis.createClient();
client.connect();
const { UserModel } = require("../model/userModel.js")

const authen = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        let decoded = jwt.verify(token, process.env.privatekey);
        let userid = decoded.userid;

        let balcklist = await client.get(`${userid}`);

        if (!balcklist) {
            res.send("login first!");
        }
        const u = await UserModel.find({ "_id": userid });

        if (!u) {
            res.send("You are not authotrized");
        }
        req.body.user = user;

        next();
    }
    catch (err) {
        res.send(err);
    }
}
module.exports = {
    authen
}