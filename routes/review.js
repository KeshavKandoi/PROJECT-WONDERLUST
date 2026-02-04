const express=require("express");
const router=express.Router({mergeParams:true}) 
const wrapAsyc=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js"); 
const { listingSchema,reviewSchema} =require("../schema.js")

const Review =require("../models/review.js") 
const Listing=require("../models/listing.js")
const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
  

const reviewController=require("../controllers/reviews.js")



// Reviews
// post route

router.post("/",isLoggedIn,validateReview,wrapAsyc(reviewController.createReview)) ;


// delete review 

router.delete("/:reviewId",isReviewAuthor,wrapAsyc(reviewController.destroyReview))



  
module.exports=router;