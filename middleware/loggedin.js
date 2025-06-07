const Listing = require("../model/listing");
const Review = require("../model/review");
const review = require("../model/review");
const { listIndexes } = require("../model/review");

module.exports.loggedin =((req,res,next)=>{
    //console.log(req.path, ".." ,req.originalUrl);//for original url
    if(!req.isAuthenticated()){
        req.session.redirectUrl =req.originalUrl;
        req.flash("error","you must be login to create listing");
        return res.redirect("/login");
    }
    next();
});

//for login and goes to the direct main page if we login for edit request we diretcly goes to the edit page
module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

//Owner

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listings");
        return res.redirect(`/listings/${id}`);
    }
   next();
}

//review
module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
   next();
}

//module.exports=loggedin;