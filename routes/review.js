const express=require("express");
const router=express.Router({mergeParams:true});
const { reviewSchema}=require("../Schema.js");
const Review=require("../model/review.js");
//const review=require("../model/review.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../model/listing");
const ExpressError=require("../utils/ExpressError.js");
const {loggedin,isReviewAuthor}=require("../middleware/loggedin.js")
const reviewController=require("../controllers/review.js")


const validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}


//POST REVIEWS ROUTE
router.post("/",loggedin,
    validateReview,
    wrapAsync(reviewController.createRoute))


//REVIEW DELETE ROUTE
router.delete("/:reviewid",loggedin,
    isReviewAuthor
    ,wrapAsync(reviewController.deleteRoute));

module.exports=router;