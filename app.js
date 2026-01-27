const express=require("express")
const app=express();
const mongoose=require("mongoose")
const Listing=require("./models/listing.js")
const path=require("path")  //ejs k liye 
const port=4000
const methodOverride=require("method-override")

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


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


app.get("/listings",async(req,res)=>{
  const allListings=await Listing.find({});
  res.render("listings/index",{allListings});
})

// new

app.get("/listings/new",(req,res)=>{
  res.render("listings/new")
})

app.post("/listings",async(req,res)=>{
   let{title,description,image,price,country,location}=req.body

  let sampleListing=new Listing({
        title:title,
        description:description,
        image:image,           // let listings=req.body.listings se sb nikal jaye gya ye sb nahi krna ho ga phir pass kr do newListing(req.body.listings;)
        price:price,
        country:country,
        location:location,
      });
      await sampleListing.save()
      res.redirect("/listings")
    })


// edit
  app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listings=await Listing.findById(id);
    res.render("listings/edit",{listings})
  })

// update 
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, country, location } = req.body;

  await Listing.findByIdAndUpdate(id, {
    title: title,
    description: description,
   image:image,
    price: price,
    country: country,
    location: location,
  });

  res.redirect("/listings");
});
// delete

app.delete("/listings/:id",async(req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");

})





app.get("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/show.ejs",{listing})
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

app.listen(port,()=>{
  console.log("Server is listening to port no 4000")
})