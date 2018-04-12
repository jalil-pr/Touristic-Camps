
var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/campground");



/////////
// CREATE ROUUTES
/////////
router.get("/campground/new",isLoggedIn,function(req,res)
{
	//res.render("new");
    res.render("new");
});


router.post("/campground",function(req,res)
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
router.get("/campground/:id",function(req,res)
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


//////////////
// EDIT ROUTE
//////////////
router.get("/campground/:id/edit",function(req,res)
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


//////////////
// UPDATE ROUTE
//////////////
router.put("/campground/:id",function(req,res)
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


///////////////
/// DELETE ROUTE
///////////////

router.delete("/campground/:id",function(req,res)
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


module.exports=router;