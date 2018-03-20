var mongoose=require("mongoose");

var CommentsSchema=new mongoose.Schema({
	text:String,
	author:String
});

module.exports=mongoose.model("Comments",CommentsSchema);