var express             = require("express"),
    bodyParser          = require("body-parser"),
    seedDB              =require("./seedDB"),
    Campgrounds         = require("./models/campground"),
    mongoose            = require("mongoose");


mongoose.connect("mongodb://localhost/final_camp_pract");


var app=express();
seedDB();

app.use("body-parser",bodyParser);
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

app.get("/",function(req,res)
{
	Campgrounds.find({},function(err,camps)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("index",{camps:allCamps});
		}
	})

});



app.listen(3000,function()
{
	console.log("server has started.");
});