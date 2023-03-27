const mongoose = require("mongoose");

const srchSchema = mongoose.Schema({
    "data": Object
})

const SrchModel = mongoose.model("search", srchSchema);

module.exports = {
    SrchModel
}