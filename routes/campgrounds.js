
var express=require("express");
var router=express.Router();
var Campgrounds=require("../models/campground");
var middleware=require("../middleware/");




router.get("/",function(req,res)
{
	Campgrounds.find({},function(err,camps)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campgrounds/index",{allcamps:camps});
		}
	})

});
// create route
router.get("/new",middleware.isLoggedIn,function(req,res)
{
    res.render("campgrounds/new");
});



// new camp
router.post("/",middleware.isLoggedIn,function(req,res)
{	
	var name=req.body.name;
	var price=req.body.price;
	var url=req.body.url;
	var desc=req.body.desc;
	var author={
		id:req.user._id,
		username:req.user.username
	};
	var newCamp=new Campgrounds({
		name:name,
		price:price,
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
			return res.redirect("/");
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

		  res.render("campgrounds/show",{camp:theCamp});

		}

	});

});

// EDIT ROUTE
router.get("/:id/edit",middleware.isUserAuthenticated,function(req,res)
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
router.put("/:id",middleware.isUserAuthenticated,function(req,res)
{
	Campgrounds.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updatedCamp)
	{
		if(err)
		{
			console.log(err);
			res.redirect("/");
		}
		res.redirect("/campground/"+updatedCamp._id);


	});

});



// DELETE ROUTE

router.delete("/:id",middleware.isUserAuthenticated,function(req,res)
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





module.exports=router;