const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()


mongoose.connect('mongodb://localhost/form', { useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', function () {
    console.log("Connected to MongoDB...")
})
db.on('error', function (err) {
    console.log(err)
})

const Data = require('./models/model')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    Data.find({}, (err, data) => {
        if (err) {
            console.log(err.message)
        } else {
            res.render('index', {
                title: 'Data',
                data: data
            })
        }
    })
})

app.get('/data/add', (req, res) => {
    res.render('add', {
        title: 'Add'
    })

})

app.get('/data/:id', (req, res) => {
    Data.findById(req.params.id, (err, data) => {
        res.render('data', {
            title: 'Your Data',
            data: data
        })
    })

})

app.post('/data', (req, res) => {
    const data = new Data()
    data.name = req.body.name
    data.text = req.body.text

    data.save((err) => {
        if (err) {
            console.log(err.message)

        } else {
            res.redirect('/')
        }
    })
})



app.listen(5000)