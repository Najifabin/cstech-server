const mongoose = require('mongoose')

const agentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})
agentSchema.virtual("tasks", {
    ref: "tasks",
    localField: "_id",
    foreignField: "agentId",
  });
  
  agentSchema.set("toObject", { virtuals: true });
  agentSchema.set("toJSON", { virtuals: true });

const agents = mongoose.model("agents",agentSchema)
module.exports = agents