//jshint esversion:6
require('dotenv').config()
const express=require("express");
const bodyParser= require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));


mongoose.connect("mongodb://127.0.0.1:27017/user",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String,
})


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})


app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})


app.post("/register",(req,res)=>{
    const user = new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save()
        .then(savedUser=>{
            res.render("secrets");
        }).catch(err=>{
            console.log(err);
        })
});

app.post("/login",(req,res)=>{
    const userName = req.body.username;
    const passWord = req.body.password;
    User.findOne({email:userName})
        .then((data)=>{
            if(data.password===passWord){
                res.render("secrets");
            }
        }).catch(err=>{
            console.log(err);
        })
})


app.listen(3000,()=>{
    console.log("server running on port 3000");
})