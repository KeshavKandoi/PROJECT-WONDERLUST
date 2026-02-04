if(process.env.NODE_ENV!="production"){
  require("dotenv").config(); 
}




const express=require("express")
const app=express();
const mongoose=require("mongoose")
// const wrapAsyc=require("./utils/wrapAsyc.js");
// const Listing=require("./models/listing.js")
// const { listingSchema,reviewSchema} =require("./schema.js") -- ye sab abhi use nahi ho rha hai 
// const Review =require("./models/review.js")

const path=require("path")  //ejs k liye 
const port=4000
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");



const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


const session=require("express-session")
const MongoStore=require("connect-mongo").default;


const flash=require("connect-flash")

const passport=require("passport")
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))// ye static file like style.css likhe ke liye hai 

// MONGODB

// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust"

const dbUrl=process.env.ATLASDB_URL


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
});

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
})
 
// session

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,  //7 days 24 hours 60 minutes 60 seconds 1000 milliseconds ,millisecond mai pass karna hota hai 
    maxAge:7*24*60*60*1000,   
    httpOnly:true,

  },
};

 

app.use(session(sessionOptions));
app.use(flash())



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  res.locals.mapToken = process.env.MAP_TOKEN;
 
  next()
})
 

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews",reviewRouter) //iske "/listings/:id/reviews" badle review use kro review.js mai 
app.use("/",userRouter)


// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delt-student"
//   });

//   let registeredUser=await User.register(fakeUser,"helloworld")
//   res.send(registeredUser);
// })



 


async function main(){
  await mongoose.connect(dbUrl);
}


main().then(()=>{
  console.log("connected to DB")
}).catch((err)=>{
  console.log(err);
})


// app.get("/",(req,res)=>{
//   res.send("Hi i am root")

// })





app.use((req,res,next)=>{
next(new ExpressError(404,"Page Not Found")); //baki sabhi route like/hi,/random sabke liye page not found aagye ga

})




app.use((err,req,res,next)=>{  
  let{statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("listings/error",{err})
// res.status(statusCode).send(message)
})


app.listen(port,()=>{
  console.log("Server is listening to port no 4000")
})