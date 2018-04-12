var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/campground");
var Comment    =require("../models/comment");





router.get("/campground/:id/comment/new",isLoggedIn , function(req,res)
{
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
router.post("/campground/:id/comment",function(req,res)
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

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}	
	res.redirect("/login");
}



module.exports=router;