const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const path = require('path')

const app_routes = require('./routes/app_routes')
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname,'/public')))
app.set('view engine','ejs')
const dbURI = 'mongodb+srv://sourav:9937382009@cluster0.uutd9.mongodb.net/demoattackuser'
mongoose.connect(dbURI,{ useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>{
   app.listen(3000,()=>{
       console.log('Listening at Port 3000')
   })
})
.catch(err=>{console.log(err)})




app.get('/',(req,res)=>{
    
    res.status(200).render('home')
})

app.get('/filepreview',(req,res)=>{
    res.status(200).render('temppdfreaderdemo');
})
app.use(app_routes);