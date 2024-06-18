import mongoose from "mongoose";
const taskSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },

    targetName: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "target",
    },
    assignedUser: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    }],
    status: {
      type: String,
      enum: ["pending", "completed","rejected"],
      default: "pending",
    },
    dueDate:{
      type:Date,
      required:true, 
 
    },
    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:"user",
    },
    progress:{
      type:Number,
      required:false,
    }
  },
  { timestamps: true }
);

const task = mongoose.model("task", taskSchema);

export default task;
