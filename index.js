const express = require('express');
const app = express();
app.use(express.json())
//
const bcrypt = require('bcrypt');
//
const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv()
addFormats(ajv)
// 
require('dotenv').config()
// enable  cors requests from liveserver on 3000 (react app)
const cors = require('cors')
app.use(cors({
  origin : process.env.ORIGIN , //"http://127.0.0.1:3000/"
  optionsSuccessStatus: 200
}))
//
const monk = require('monk');
const db = monk(process.env.DB_URI)
// const all = db.get('characters')
//
app.listen(process.env.PORT , () => console.log('i am here'))
//

// here handle all api calls
const API = require('./routes/api_router')
app.use('/api/v1' , API)
//
var morgan = require('morgan')
app.use(morgan('tiny'))
//
const Joi = require('@hapi/joi')
const schema2 = Joi.object({
  username : Joi.string().trim().required() ,
  password : Joi.string().trim().required()
})
// const value = await <schema-name>.validateAsync(req.body)


// need to add second route
app.post('/login' , async (req , res ) => {
   
  
  try {
     await schema2.validateAsync(req.body)
    console.log(value2)

   let data = await db.get('users').findOne({username : value2.username , password : value2.password});
   console.log(data)
    if (data) { // check if user exist and check password
      res.status(200).redirect('/api/v1')
      return
     }  else{
       res.status(401).redirect('/login')
       
     }
   
   } catch(err) {
     res.send(err)
   
   }
})

let path = require('path');
const { match } = require('assert');

app.get('/login' , (req , res , next) => {
  // we need to check if he is alrady loged , if he is redirect
 // res.sendFile(path.join(__dirname, './web', 'login.html'));
})

app.get('/' , (req , res , next) => {
  // res.sendFile(path.join(__dirname, './web', 'login.html')); => just test thing
})

//this make "web" folder awailabe
app.use(express.static('web'));




//
const schemaRegister = {
  type: "object",
  properties: {
    username: {type: "string" ,  "minLength" : 5 },
    password: {type: "string" , "minLength" : 8},
    email : {type : "string" , format: "email"}
  },

    required: ["username"],
  required: ["password"],
  required: ["email"],
  additionalProperties: false
   
}
const validate = ajv.compile(schemaRegister)
//

app.post('/register' , async (req , res , next) => {
// TODO : add repeat password function
  try {
  
    const valid = await validate(req.body)
    if(!valid) {
      res.status(400)
       throw new Error('username must be over 5 characters , password must be over 8 caracters , and mail must be valid')
    } 
    
    const { username  , email } = req.body //deconstructuring
    let { password } = req.body 
    const checkMail = await db.get('schema-test').findOne({ email})
   //  console.log(checkMail)
   if(checkMail) {
    res.status(400) 
    throw new Error('that mail is in use , pls select another one')
  }
  const checkUsername = await db.get('schema-test').findOne({ username})
  // console.log(checkUsername)
  if(checkUsername) {
  res.status(400) 
  throw new Error('that usernmae is in use , pls select another one')
 }  
// console.log("starting hashing");
 hash = await bcrypt.hash(password , 14);
 const userNew = await db.get('schema-test').insert({username  , password : hash , email })
        
    // cant send json and redirect ??
      res.status(200).json({
        message: "you have successfully creacted account , with username" ,
        successs : true ,
         username : userNew.username ,
         email : userNew.email
      })  
     // res.redirect("/login")

  } catch(err) {
    res.status(400).json({
      message : err.message ,
      success : false
    })
  }
  
})




// login schema
const schemaLogin = {
  type: "object",
  properties: {
    username: {type: "string" ,  "minLength" : 5 },
    password: {type: "string" , "minLength" : 8}
  },

    required: ["username"],
  required: ["password"],
  additionalProperties: false
   
}
const validateLogin = ajv.compile(schemaLogin)
// test route for login
app.post('/login-test' , async (req , res , next) => {

  try {
   const valid = await validateLogin(req.body)
   if(!valid) {
     res.status(400) 
    throw new Error("invalid request , please reformat and try again later") 
   }
   const {username , password} = req.body
   const checkName = await db.get('schema-test').findOne({ username })
   console.log(checkName);
   if(!checkName) {
    throw new Error("There is no user with that name") 
   }
  //  console.log(password , checkName.password)
   const match = await  bcrypt.compare(password , checkName.password);
   console.log(match)


if(!match) {
  throw new Error("Invalid username and password") 
}
res.status(200).json({
  message : "username and password are correct" ,
   succes : true
})

  } catch(err) {
    res.status(401).json({
      message : err.message ,
      success : false 
    })
  }

})


// debugger for hash  
// async function debug(password , hash) {
//   console.log(x , "x")
//   console.log(y , "y");
//   const match = await  bcrypt.compare(x , y);
// console.log(match);
//   return match
// }
//  debug("password" , "hash");