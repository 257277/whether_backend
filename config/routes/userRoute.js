const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require("redis");
const client = redis.createClient();
client.connect();
require("dotenv").config();

const { UserModel } = require("../model/userModel.js");
const { hashing } = require("../middleware/bcrypt.js")
const userRoute = express.Router();

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const u = await UserModel.find({ email });
        if (!u) {
            res.send("wrong credentials");
        }
        let pm = bcrypt.compare(password, u[0].password);
        if (!pm) {
            res.send("wrong credentials");
        }
        let token = jwt.sign({ userid: u[0]._id }, process.env.privatekey);

        res.send({ "msg": "login Successfully", "token": token });
    }
    catch (err) {
        console.log(err);
        res.send("Try Again");
    }
})
userRoute.post("/logout", async (req, res) => {
    let userid = req.query.id;
    let token = req.headers.authorization;
    try {
        client.set(`${userid}`, `${token}`);
        // let z = await client.get(`${userid}`);
        // console.log(z);
        res.send("Successfully logout");
    }
    catch (err) {
        res.send(err);
    }
})

userRoute.use(hashing);
userRoute.post('/register', async (req, res) => {

    try {
        await UserModel.insertMany(req.body);
        res.send("Successfully registered");

    } catch (err) {
        res.send(err);
    }
})

module.exports = {
    userRoute
}