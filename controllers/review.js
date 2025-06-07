const Listing=require("../model/listing");
const Review=require("../model/review")

module.exports.createRoute=async(req,res)=>{
   // console.log(req.params.id);
   let listing= await Listing.findById(req.params.id);
   let newReview=await Review(req.body.review);
   newReview.author=req.user._id;
   //console.log(newReview);

   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success","New Review created");
   res.redirect(`/listings/${listing.id}`);
};

module.exports.deleteRoute=async(req,res)=>{
    let{id,reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);

    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};