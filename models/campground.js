var mongoose=require("mongoose");


var CampSchema=new mongoose.Schema({
	name:String,
	price:String,
	url:String,
	desc:String,
	comments:[

			{
				  type:mongoose.Schema.Types.ObjectId,
				  ref:"Comments"			
			}
	],

	
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
   });

module.exports=mongoose.model("Campground",CampSchema);