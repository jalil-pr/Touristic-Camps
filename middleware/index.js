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
					req.flash("error","some error loading the comment!");
					res.redirect("/");
				}
				if(foundComment.author.id.equals(req.user._id))
				{
					
					next();
				}
				else
				{
					req.flash("error","you don't have permission to do that!");
					res.redirect("back");
				}
			});

	   }
	   else
	   {
	   	req.flash("error","please login first!");

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

					req.flash("error","faced some problem finding the camp!")
					res.redirect("/");
				}
				
				if(foundCamp && foundCamp.author.id.equals(req.user._id))
				{
					console.log()
					req.flash("success","now you can edit the camp");
					next();
				}
				else
				{
                    req.flash("error","the camp does not belonge to you, so you can't do that!")
					res.redirect("back");
				}
			});

	   }
	   else
	   {
	   	req.flash("error","please do whatever you are allowed to!");
	   	res.redirect("back");
	   }
};
middlewareObject.isLoggedIn=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		 next();
	}	
	else
	{
		req.flash("error","please login first");
	    res.redirect("/login");

	}
	
}









module.exports=middlewareObject;