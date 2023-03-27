// import fetch from 'node-fetch';
const express = require("express");

require("dotenv").config();
const { authen } = require("../middleware/jwt.js")
const whetherRoute = express.Router();
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const redis = require("redis");
const client = redis.createClient();
client.connect();

// const { UserModel } = require("../model/userModel.js")
const { SrchModel } = require("../model/searchModel");

// whetherRoute.use(authen);

whetherRoute.get("/", async (req, res) => {
    let city = req.query.city;
    let key = req.query.key;
    let z = await client.get(`${city}`);
    if (z) {
        res.send(z);
    }
    else {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${key}`;
        console.log(url);
        let d = await fetch(url);

        let r = await d.json();
        client.set(`${city}`, `${JSON.stringify(r)}`);
        client.expire(`${city}`, 1800);

        await SrchModel.insertMany({ "data": r });
        res.send(r);
    }
})













module.exports = {
    whetherRoute
}