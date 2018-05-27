var express=require("express");
var router=express.Router({mergeParams:true});
var Campgrounds=require("../models/campground");
var Comment    =require("../models/comment");




// Comments new
router.get("/new",isLoggedIn , function(req,res)
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
router.post("/",isLoggedIn,function(req,res)
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
			createdComment.author.id=req.user._id;
			createdComment.author.username=req.user.username;
			createdComment.save();
			foundCamp.comments.push(createdComment._id);
			foundCamp.save();
			res.redirect("/campground/"+foundCamp._id);

		});

	});

});


router.get("/:comment_id/edit",isUserAuthenticated,function(req,res)
{
	res.send("it works bro")
	// Comment.findById(req.params.comment_id,function(err,foundComment)
	// {
	// 	if(err)
	// 	{
	// 		console.log(err);
	// 		res.redirect("back");
	// 	}
	// 	else
	// 	{
	// 		res.render("comments/edit",{campground_id:req.params.id,foundComment:foundComment});
	// 	}

	// });
	

});


// update route

router.put("/:comment_id",function(req,res)
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
			res.redirect("/campground/"+req.params.id);
		}
	});
	

});

router.delete("/:comment_id/delete",function(req,res)
{
    res.send("it work too");
	// Comment.findByIdAndRemove(req.params.comment_id,function(err)
	// {
	// 	if(err)
	// 	{
	// 		console.log("could not delete the comment.");

	// 	}
	// 	res.send("you have hitted delete route")
	// 	//res.redirect("/campground/"+req.params.id);

	// });

});

function isUserAuthenticated(req,res,next)
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
}


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