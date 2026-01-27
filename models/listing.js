const mongoose=require("mongoose")
const Schema=mongoose.Schema

const listingSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  description:String,
 
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://unsplash.com/photos/two-figures-walk-towards-a-large-cathedral-in-fog-JFet8xoge7U",
        set:(v)=> v===""?"https://unsplash.com/photos/two-figures-walk-towards-a-large-cathedral-in-fog-JFet8xoge7U":v,
    },
  },

  price:Number,
  location:String,
  country:String,
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing