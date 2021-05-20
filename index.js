const express = require('express');
const app = express();
app.use(express.json())
// 
require('dotenv').config()

// enable  cors requests from liveserver on 5500
const cors = require('cors')
app.use(cors({
  origin : "http://127.0.0.1:5500" , 
  optionsSuccessStatus: 200
}))
//
const monk = require('monk');
const db = monk(process.env.DB_URI)
// const all = db.get('characters')
//
const Joi = require('@hapi/joi')
 const  schema =  Joi.object({
   name : Joi.string().trim().required() ,
   nickname : Joi.string().trim() ,
 })

 app.listen(process.env.PORT , () => console.log('i am here'))

// READ ALL
app.get( '/' , async (req , res , next) => {
  try {
    const items = await db.get('characters').find({});

    res.status(200)
    .json(items);

  } catch (err) {
     next(err)
     console.log(err)
  }
    
})
// READ ONE
app.get( '/:id' , async (req , res , next) => {
  try {
    const { id } =  req.params ;
    const item = await db.get('characters')
    .findOne({ _id : id });
   console.log('works' , item)

      if(!item)  return res.status(404)
      .json({message : "item not found"})
    
    res.status(200).json(item)
  } catch(err) {
    res.status(400)
    next(err)
  }


})

// CREATE ONE
app.post( '/:id' , async (req , res , next) => {
  try{
     
     const value = await schema.validateAsync(req.body) 
    const added = await db.get('characters').insert({
      name : value.name , _id :  req.params.id 
    })
    res.status(200)
    .json({ message : "you added your name successfully" , added })

  } catch (err){
    res.status(400)
    next(err)
  }
    
})
// UPDATE ONE
app.put( '/:id' , async (req , res , next) => {
  
  try{
    
   const value = await schema.validateAsync(req.body)
   const item = await db.get('characters').findOne({
     _id :  req.params.id 
   })
  
   if (!item) return next()
  
   await db.get('characters').update({
  _id : req.params.id  ,
} ,
 { $set : value }
)

   res.status(200)
   .json({ message : "you updated your name successfully"  , "old" : item.name   ,
    "new" : value.name })

 } catch (err){
   res.status(400)
   next(err)
 }


})

// DELETE ONE
app.delete( '/:id' , async (req , res , next) => {
  
  try{
    const { id } = req.params ;
    const item = await db.get('characters').findOne({
      _id :  req.params.id 
    })
    if (!item) {
  res.status(404).send("404 item not found")
    } 

  const deleted =  await  db.get('characters').remove({
      _id :  id
    })


    res.status(200).json({
      'message' : "you have deleted succesfully"
    })
  } catch {
    next(err)
  }
 
})


// const db = monk(process.env.DB_URI)
const schema2 = Joi.object({
  username : Joi.string().trim().required() ,
  password : Joi.string().trim().required()
})


// need to add second route
app.post('/users/login' , async (req , res , next) => {
   try {
    const value2 = await schema2.validateAsync(req.body)
     

   let data = await db.get('users').findOne({username : value2.username});
   console.log(data)
    if (data && data.username == value2.username) { // check if username is available
      res.status(400).json({message : `${value2.username} is in use , pls select another name`})
      return
     }  
     let user = await db.get('users').insert({
      username : value2.username , password : value2.password
     });
   
   res.json({message : "you posted successfully" , you : user})
   } catch(err) {
   next(err)
   
   }
})








// const mongoose = require('mongoose');
// const url = 'mongodb://127.0.0.1:27017/test-data-base' ;
// // connect to mongoDB
// mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true });


// const db = mongoose.connection
// db.once('open', _ => {
//   console.log('Database connected:', url)
// })

// db.on('error', err => {
//   console.error('connection error:', err)
// })




