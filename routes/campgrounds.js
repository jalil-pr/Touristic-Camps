
var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/campground");


// create route
router.get("/new",isLoggedIn,function(req,res)
{
	//res.render("new");
    res.render("new");
});

// new camp
router.post("/",isLoggedIn,function(req,res)
{
	var name=req.body.name;
	var url=req.body.url;
	var desc=req.body.desc;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCamp=new Campgrounds({
		name:name,
		url:url,
		desc:desc,
		author:author
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

// show route
router.get("/:id",function(req,res)
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



// EDIT ROUTE

router.get("/:id/edit",function(req,res)
{
	Campgrounds.findById(req.params.id,function(err,foundCamp)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/");
		}

		res.render("campgrounds/edit",{camp:foundCamp});

	});
});



// UPDATE ROUTE

router.put("/:id",function(req,res)
{
	Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/");
		}
		res.redirect("/campground/"+req.params.id);


	});

});



// DELETE ROUTE

router.delete("/:id",function(req,res)
{
	Campgrounds.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			res.redirect("/");
		}
		else
		{
			res.redirect("/");
		};
	})
});

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}	
	res.redirect("/login");
}

// exporting route


module.exports=router;