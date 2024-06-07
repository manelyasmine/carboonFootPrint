import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstname:{
      type: String,
      required: false
    },
    lastname: {
      type : String,
      required: false
    },
    phone: {
      type : String,
      required: false
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, 
    },
    city:{
      type: String,
      required: false
    },
    country:{
      type: String,
      required: false
    },
    timezone:{
      type: String,
      required: false
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    status:{
      type: String,
      enum: ["active", "desactive"],
      default: "active",
    },
    phone:{
      type:String,
      required:false,
    },
    roles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',  
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }

  },
  { timestamps: true, strict : false}
);

const user = mongoose.model("user", userSchema);
export default user;
