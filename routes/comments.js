

var express=require("express");
var router=express.Router({mergeParams:true});
var Campgrounds=require("../models/campground");
var Comment    =require("../models/comment");
var middleware  =require("../middleware/");


// Comments new
router.get("/new",middleware.isLoggedIn , function(req,res)
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

// comments create
router.post("/",middleware.isLoggedIn,function(req,res)
{
	Comment.create(req.body.comment,function(err,createdComment)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","some problem posting your comment! we are sorry for that!");
			res.redirect("/");
		}
		else
		{
			Campgrounds.findById(req.params.id,function(err,foundCamp)
			{
				if(err)
				{
					console.log(err);
					res.redirect("/");
				}
				createdComment.author.id=req.user._id;
				createdComment.author.username=req.user.username;
				createdComment.save();
				foundCamp.comments.push(createdComment._id);
				foundCamp.save();
				req.flash("success","your comment succesfully posted.");
				res.redirect("/campground/"+foundCamp._id);

			});

		}
		

	});

});

// Edit route
router.get("/:comment_id/edit",middleware.isCommentorAuthenticated,function(req,res)
{
	
	Comment.findById(req.params.comment_id,function(err,foundComment)
	{
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		else
		{

			res.render("comments/edit",{campground_id:req.params.id,foundComment:foundComment});
		}

	});
	
});


// update route

router.put("/:comment_id",middleware.isCommentorAuthenticated,function(req,res)
{
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment)
	{
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		else
		{
			req.flash("success","your comment has been edited");
			res.redirect("/campground/"+req.params.id);
		}
	});
	

});

router.delete("/:comment_id",middleware.isCommentorAuthenticated,function(req,res)
{

	Comment.findByIdAndRemove(req.params.comment_id,function(err)
	{
		if(err)
		{
			console.log("could not delete the comment.");

		}
		req.flash("success","comment deleted!")
		res.redirect("/campground/"+req.params.id);

	});

});


// exporting router
module.exports=router;