const express = require("express");
require("dotenv").config();
const app = express();
const { connection } = require("./config/db.js");
const { userRoute } = require("./config/routes/userRoute.js");
const { whetherRoute } = require("./config/routes/whetherroute.js");
app.use(express.json());
var expressWinston = require('express-winston');
var winston = require('winston');
app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: "log.txt" })
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.use("/user", userRoute);
app.use("/whether", whetherRoute);



app.listen(process.env.port, async () => {
    try {

        await connection;
        console.log("Successfully connected to database");
    }
    catch (err) {
        console.log(err);
    }
    console.log(`Server is runing on port ${process.env.port}`);
})