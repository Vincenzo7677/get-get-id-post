const mongoose = require('mongoose')


const data = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: false
    }
})

const Data = module.exports = mongoose.model('Data', data)