var express=require("express");
var router=express.Router({mergeParams:true});
var Campgrounds=require("../models/campground");
var Comment    =require("../models/comment");




// Comments new
router.get("/new",isLoggedIn , function(req,res)
{
	console.log(req.params.id);
	Campgrounds.findById(req.params.id,function(err,foundCamp)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("comments/new",{camp:foundCamp});
		}

	});


});

// comments create
router.post("/",function(req,res)
{
	Comment.create(req.body.comment,function(err,createdComment)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/");
		}
		Campgrounds.findById(req.params.id,function(err,foundCamp)
		{
			if(err)
			{
				console.log(err);
				res.redirect("/");
			}
			foundCamp.comments.push(createdComment._id);
			foundCamp.save();
			res.redirect("/campground/"+foundCamp._id);

		});

	});

});

// middleware to check if the user is authenticated
function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}	
	res.redirect("/login");
}


// exporting router
module.exports=router;