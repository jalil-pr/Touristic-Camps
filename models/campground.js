var mongoose=require("mongoose");


var CampSchema=new mongoose.Schema({
	name:String,
	url:String,
	desc:String,
	comments:[

			{
				  type:mongoose.Schema.Types.ObjectId,
				  ref:"Comment"			
			}
	]

	}
   );

module.exports=mongoose.model("Campground",CampSchema);