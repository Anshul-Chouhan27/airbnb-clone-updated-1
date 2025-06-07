if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {listingSchema,reviewSchema}=require("../Schema.js");
const Listing=require("../model/listing");
const {loggedin,isOwner}=require("../middleware/loggedin.js")
const listingController=require("../controllers/listings.js");

const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({ storage })

const validateSchema=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


//INDEX ROUTE
router.get("/"
    ,wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new",loggedin,listingController.newRoute);


//SHOW ROUTE
router.get("/:id" 
    ,wrapAsync(listingController.showRoute));


//CREATE ROUTE PREVIOUS
// app.post("/listings",(req,res)=>{
//     let {title,description,price,location,country}=req.body.listing;
//     let newlisting= new Listing({
//         title:title,
//         description:description,
//         price:price,
//         location:location,
//         country:country,
//     });
//     console.log(newlisting);
//     newlisting.save().then((res)=>{
//         console.log("sd");
//     }).catch((err)=>{
//         console.log(err);
//     })
//     res.redirect("/listings");
// })


//CREATE ROUTE (new way)
router.post("/",loggedin,
    upload.single('listing[image]'),
    validateSchema,
    wrapAsync(listingController.createRoute));

// router.post("/", upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// }) 

//EDIT ROUTE 
router.get("/:id/edit",
    loggedin,
    isOwner
    ,wrapAsync(listingController.editRoute));

//UPDATE ROUTE
router.put("/:id",
    loggedin,
    isOwner,
    upload.single('listing[image]'),
    validateSchema,
    wrapAsync(listingController.updateRoute));

//DELETE ROUTE
router.delete("/:id",
    loggedin,
    isOwner,
    wrapAsync(listingController.deleteRoute));

module.exports=router;