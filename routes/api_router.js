const express = require('express');
let router = express.Router();
// make schema
const Joi = require('@hapi/joi')
const  schema =  Joi.object({
  name : Joi.string().trim().required() ,
  nickname : Joi.string().trim() ,
})
//conect to database
const monk = require('monk');
const db = monk(process.env.DB_URI)

// READ ALL
router.get( '/' , async (req , res , next) => {
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
router.get( '/:id' , async (req , res , next) => {
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
router.post( '/:id' , async (req , res , next) => {
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
router.put( '/:id' , async (req , res , next) => {
 
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
router.delete( '/:id' , async (req , res , next) => {
 
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

module.exports = router ;

