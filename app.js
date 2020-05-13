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
app.use(express.static(path.join(__dirname,'public')))



app.get('/', (req,res) => {
    Data.find( {}, (err,data) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {
                title: 'All Data',
                data: data
            })
        }
    } )
})
app.get('/data/add', (req,res) => {
    res.render('add', {
        title: 'Add'
    })
})
app.post('/data', (req,res) => {
    const data = new Data()
    data.name = req.body.name
    data.text = req.body.text
    
    data.save( (err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})
app.get('/data/:id', (req,res) => {
    Data.findById(req.params.id, (err,data) => {
     res.render('data', {
                data: data
                })
    })        
})
app.get('/data/edit/:id', (req,res) => {
    Data.findById(req.params.id, (err,data) => {
        if (err){
            console.log(err)
        } else {
            res.render('edit', {
                title: 'Edit',
                data: data
            })
        }
    })
})

app.post('/data/edit/:id', (req,res) => {
    const data = {}
    data.name = req.body.name
    data.text = req.body.text

    const query = {
        _id: req.params.id
    }
    Data.updateOne(query, data, (err,) => {
        if (err) {
            console.log(err) 
            return
            } else {
                res.redirect('/')
            }
        })
    })

app.delete('/data/:id', (req,res) => {
    const query = {
        _id:req.params.id
    }

    Data.deleteOne(query, (err) => {
        if (err) {
            console.log(err)
        }
        res.send('Success')
    })
})


app.listen(5000)