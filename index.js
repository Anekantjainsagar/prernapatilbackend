const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = 5000
const Contact = require('./model/model')

mongoose.connect('mongodb+srv://blog:blog1234@cluster0.uv0j1qr.mongodb.net/BlogApp').then(()=>{
    console.log("Connection successful...");
}).catch((err)=>{
    console.log(err);
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send('Hello world')
})

app.post('/contact',(req,res)=>{

    const {name,email,message} = req.body

    const contact = new Contact({name, email, message})
    contact.save().then(()=>{
        res.status(200).json({Success:true,message:contact});
    }).catch((err)=>{
        res.status(204).json({Success:false,message:err});
    })

})

app.listen(port,()=>{
    console.log(`Tuffle is running at port ${port}`);
})