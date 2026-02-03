 const express=require("express");
 const router=express.Router()
 const wrapAsyc=require("../utils/wrapAsyc.js");
 const { listingSchema,reviewSchema} =require("../schema.js")
 const ExpressError=require("../utils/ExpressError.js");
 const Listing=require("../models/listing.js")


 const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")









// INDEX ROUTE

// router.get("/listings",async(req,res)=>{
//   const allListings=await Listing.find({});
//   res.render("listings/index",{allListings});
// })
 

router.get("/",
wrapAsyc(async(req,res)=>{
  const allListings=await Listing.find({})
  res.render("listings/index",{allListings});
})
);
// NEW ROUTE

router.get("/new",isLoggedIn,(req,res)=>{
  res.render("listings/new")
})


// show route

router.get("/:id",wrapAsyc(async(req,res)=>{
  let{id}=req.params;
  const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error","Listing you requested for does not exist")
   return res.redirect("/listings")
  }
  res.render("listings/show",{listing})
}));




// create route

router.post("/",isLoggedIn,validateListing,wrapAsyc(async(req,res)=>{
  
    let{title,description,image,price,country,location}=req.body

  let sampleListing=new Listing({
        title:title,
        description:description,
                                                                  // let listings=req.body.listings se sb nikal jaye gya ye sb nahi krna ho ga phir pass kr do newListing(req.body.listings;)
        image: {
          filename: "listingimage",
          url: image,
        },
        price:price,
        country:country,
        location:location,
        owner: req.user._id  
      });
      await sampleListing.save()
      req.flash("success","New Listing Created!")
      res.redirect("/listings")
   
    })
  );




// edit
  router.get("/:id/edit",isLoggedIn,isOwner,async(req,res)=>{
    let{id}=req.params;
    const listings=await Listing.findById(id);
    if(!listings){
      req.flash("error","Listing you requested for does not exist")
     return res.redirect("/listings")
    }
    res.render("listings/edit",{listings})
  })

// update 

router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsyc(async (req, res) => {
  let { id } = req.params; 
  let { title, description, image, price, country, location } = req.body; 
  
  await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: {
      filename: "listingimage",
      url: image,
    },
    price,
    country,
    location,
  });
  req.flash("success","Listing updated")

  res.redirect("/listings");
})

);

// DELETE

router.delete("/:id",isLoggedIn,isOwner,wrapAsyc(async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!")
  res.redirect("/listings");

})

);

module.exports=router;