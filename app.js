require("dotenv").config()
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption");
const ejs = require("ejs");
const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
const secret=process.env.SECRET;
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ["password"],
});
const User=mongoose.model('User',userSchema);
app.get('/', (req, res) => {
    res.render("home.ejs");
})
app.get('/login', (req, res) => {
    res.render("login.ejs");
})
app.get('/register', (req, res) => {
    res.render("register.ejs");
})

app.post('/register',async(req,res)=>{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    try {
        await newUser.save();
        console.log('Saved successfully');
        res.render('secrets'); 
      } catch (error) {
        console.error(error);
        // Handle error appropriately
        res.status(500).send('Error saving user');
      }
});

app.post('/login',async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    try{
        const user = await User.findOne({ email: username });
        // console.log(user);
        console.log(user.password==password)
        if(!user || user.password!==password)
        {
            return res.status(401).send('Invalid username or password');
        }else
        {
            // console.log("hello password matched");
            res.render("secrets");
        }
    }catch(err)
    {
        console.log(err);
        res.status(500).send('Login failed');
    }

})

app.get('/logout',(req,res)=>{
    res.render("home");
})
app.listen(3000, function () {
    console.log("server is running on port 3000");
});