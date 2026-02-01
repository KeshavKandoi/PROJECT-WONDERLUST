const express=require("express")
const app=express();
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path")  //ejs k liye 
const port=4000
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const wrapAsyc=require("./utils/wrapAsyc.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} =require("./schema.js")
const Review =require("./models/review.js")
const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"


app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))// ye static file like style.css likhe ke liye hai 



main().then(()=>{
  console.log("connected to DB")
}).catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
  res.send("Hi i am root")

})





const validateListing=(req,res,next)=>{
  let  {error}=listingSchema.validate(req.body);
  
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
     
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
}





const validateReview=(req,res,next)=>{
  let  {error}=reviewSchema.validate(req.body);
  
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",")
     
    throw new ExpressError(400,errMsg)
  }else{
    next();
  }
}






app.get("/listings",async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("listings/index",{allListings});
})
 
// new

app.get("/listings/new",(req,res)=>{
  res.render("listings/new")
})


// show route

app.get("/listings/:id",wrapAsyc(async(req,res)=>{
  let{id}=req.params;
  const listing= await Listing.findById(id).populate("reviews");
  res.render("listings/show",{listing})
}));




// create route

app.post("/listings",validateListing,wrapAsyc(async(req,res)=>{
  
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
      });
      await sampleListing.save()
      res.redirect("/listings")
   
    })
  );




// edit
  app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listings=await Listing.findById(id);
    res.render("listings/edit",{listings})
  })

// update 

app.put("/listings/:id", validateListing,wrapAsyc(async (req, res) => {
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

  res.redirect("/listings");
})

);

// delete

app.delete("/listings/:id",wrapAsyc(async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");

})

);
// Reviews
// post route

app.post("/listings/:id/reviews",validateReview,wrapAsyc(async(req,res)=>{
  let listing=await Listing.findById(req.params.id)
  let newReview=new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  
res.redirect(`/listings/${listing ._id}`);

})) ;


// delete review 

app.delete("/listings/:id/reviews/:reviewId",wrapAsyc(async(req,res)=>{
  let{id,reviewId}=req.params;

  await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
  
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`)
}))















app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found")); //baki sabhi route like/hi,/random sabke liye page not found aagye ga

})





// app.get("/testListing",async(req,res)=>{
//   let sampleListing=new Listing({
//     title:"My New Villa",
//     description:"By the beach",
//     price:1200,
//     location:"calangute,Goa",
//     country:"India",
//   });
//   await sampleListing.save()
//   console.log("sample was saved");
//   res.send("successful")
// })


app.use((err,req,res,next)=>{  
  let{statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("listings/error",{err})
// res.status(statusCode).send(message)
})


app.listen(port,()=>{
  console.log("Server is listening to port no 4000")
})