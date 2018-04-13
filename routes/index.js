
var express=require("express");
var passport=require("passport");
var Campgrounds=require("../models/campground");
var User       =require("../models/user");
var router =express.Router();






// INDEX ROUT

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
			res.render("index",{allcamps:camps});
		}
	})

});



// SIGN UP ROUTES

router.get("/register",function(req,res)
{
	res.render("auth/register");

});

router.post("/register",function(req,res)
{
	
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user)
	{
		if(err)
		{

			console.log(err);
			return res.render("auth/register");
		}
		else
		{
			passport.authenticate("local")(req,res,function()
			{
				res.redirect("/");

			});

		}

	});

});



// LOGIN ROUTES

router.get("/login",function(req,res)
{

	res.render("auth/login");

});
// login route

router.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res)
{

});
// logout route
router.get("/logout",function(req,res)
{
	req.logout();
	res.redirect("/");
});

// checking the authentication middleware
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