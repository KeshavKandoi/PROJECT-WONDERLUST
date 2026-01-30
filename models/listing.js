const mongoose=require("mongoose")
const Schema=mongoose.Schema

const listingSchema=new Schema({
  title:{
    type:String,
    required:true,
  },
  description:String,
 
  // image: {
  //   filename: String,
  //   url: {
  //     type: String,
  //     default:
  //       "https://unsplash.com/photos/two-figures-walk-towards-a-large-cathedral-in-fog-JFet8xoge7U",
  //       set:(v)=> v===""?"https://unsplash.com/photos/two-figures-walk-towards-a-large-cathedral-in-fog-JFet8xoge7U":v,
  //   },
  // },
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },
  

  price:Number,
  location:String,
  country:String,
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing