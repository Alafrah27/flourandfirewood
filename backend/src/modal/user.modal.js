
import mongoose from "mongoose"
const  {Schema , model } = mongoose;

const userSchema = new Schema({
  clerkId:{
    type :String,
    required:true,
    unique:true
  } ,
  
    fullname:{
      type:String
    },
    email:{
      type:String,
      unique:true,
      required:true

    },
    imageUrl:{
        type:String
    },
    role:{
      type:String,
      enum:["user","admin"],
      default:"user"
    },

    isBlocked:{
     type:Boolean,
     default: false
    }
  
},{
    timestamps:true
})


const User = model("User",userSchema)
export default User