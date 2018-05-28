var mongoose=require("mongoose");
var Comment=require("../models/comment");
var Campgrounds=require("../models/campground");

var middlewareObject={};

middlewareObject.isCommentorAuthenticated=function(req,res,next)
{
	   if(req.isAuthenticated())
	   {
		   	Comment.findById(req.params.comment_id,function(err,foundComment)
			{
				if(err)
				{
					console.log(err);
					res.redirect("/");
				}
				if(foundComment.author.id.equals(req.user._id))
				{
					next();
				}
				else
				{
					res.redirect("back");
				}
			});

	   }
	   else
	   {

	   	res.redirect("back");

	   }
};
middlewareObject.isUserAuthenticated=function(req,res,next)
{
	 if(req.isAuthenticated())
	   {
		   	Campgrounds.findById(req.params.id,function(err,foundCamp)
			{
				if(err)
				{
					console.log(err);
					res.redirect("/");
				}
				if(foundCamp.author.id.equals(req.user._id))
				{
					next();
				}
				else
				{
					res.redirect("back");
				}
			});

	   }
	   else
	   {
	   	res.redirect("back");
	   }
};
middlewareObject.isLoggedIn=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}	
	res.redirect("/login");
}









module.exports=middlewareObject;