const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const app = express()
const bcrypt = require('bcrypt')



// app.use(express)

app.set('view engine','ejs')
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser:true}).then(console.log('connected to DB'))
app.use(express.json())


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})



const User = new mongoose.model("User",userSchema)

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',async(req,res)=>{
    const {email,password} = req.body
    try{
        const salt = bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const savedUser = await User.create({email,password:hashedPassword})
        res.status(200).json(savedUser)
      console.log(savedUser) 
    }catch(err){
        res.status(400).json(err)
    }
})

app.post('/login',async(req,res)=>{
    const {email,password} = req.body
    try{
        const user = User.findOne({email})
        !user && res.status(400).json('No user was found')
        const isValidPassword = bcrypt.compare(password,user.password)
        !isValidPassword&& res.status(400).json('invalid password')
        const {password,...others} = user._doc
        res.status(200).json(others)
    }catch(err){ 
        res.status(400).json(err)
    }
})

app.listen(4000,()=>console.log('app running on port 4000'))