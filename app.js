var express             = require("express"),
    bodyParser          = require("body-parser"),
    seedDB              =require("./seedDB"),
    Campgrounds         = require("./models/campground"),
    Comments            = require("./models/comment"),
    mongoose            = require("mongoose");


mongoose.connect("mongodb://localhost/final_camp_pract");


var app=express();
seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");


//////////////
// INDEX ROUT
//////////////
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
			res.render("index",{allcamps:camps});
		}
	})

});



/////////
// CREATE ROUUTES
/////////
app.get("/campground/new",function(req,res)
{
	//res.render("new");
    res.render("new");
});


app.post("/campground",function(req,res)
{
	var name=req.body.name;
	var url=req.body.url;
	var desc=req.body.desc;
	var newCamp=new Campgrounds({
		name:name,
		url:url,
		desc:desc
	});
	Campgrounds.create(newCamp,function(err,createdCamp)
	{
		if(err)
		{
			res.redirect("/campground/new");
		}
		else
		{
			res.redirect("/");
		}


	});


});

//////////////
//  SHOW ROUT--> to show a specific camp in details
//////////////
app.get("/campground/:id",function(req,res)
{
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err,theCamp)
	{
		if(err)
		{
			console.log(err);

		}
		else
		{

		  res.render("show",{camp:theCamp});

		}

	});

});
////////////////
//COMMENTS ROUTES
////////////////
app.get("/campground/:id/comment/new",function(req,res)
{
	Campgrounds.findById(req.params.id,function(err,camp)
	{
		if(err)
		{
			res.redirect("/");
		}
		res.render("comments/new",{camp:camp});

	});
	
});
app.post("/campground/:id/comment",function(req,res)
{
     Campgrounds.findById(req.params.id,function(err,foundCamp)
     {
     	if(err)
     	{
     		console.log(err);
     		res.redirect("/");
     	}
     	Comments.create({
     		text:req.body.text,
     		author:req.body.author
     	},function(err,createdComment)
     	{
     		if(err)
     		{
     			console.log(err);
     		}
     		foundCamp.comments.push(createdComment._id);
     		foundCamp.save();
     		res.redirect("/campground/"+foundCamp._id);

     	});


     });





	// Comments.create({
	// 	text:req.body.text,
	// 	author:req.body.author
	// },function(err,createdComment)
	// {
	// 	if(err)
	// 	{
	// 		console.log(err)
	// 		res.redirect("/campground/:id/comment/new");
	// 	}
	// 	else
	// 	{
	// 		Campgrounds.findById(req.params.id,function(err,camp)
	// 		{
	// 			if(err)
	// 			{
	// 				console.log(err);
	// 	            res.redirect("/");
	// 			}
	// 			camp.comments.push(createdComment._id);
	// 			camp.save();
	// 			res.redirect("/campground/req.params.id");
	// 		})
	// 	}
	// })

});









app.listen(3000,function()
{
	console.log("server has started.");
});