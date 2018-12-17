
var      express       =require("express"),
         passport      =require("passport"),
         Campgrounds   =require("../models/campground"),
         User          =require("../models/user"),
         router        =express.Router();


// INDEX ROUT
router.get("/",function(req,res)
{
	res.render("landing");

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
	successRedirect:"/campground/",
	failureRedirect:"/login"
}),function(req,res)
{

});

// logout route
router.get("/logout",function(req,res)
{
	req.logout();
	req.flash("success","successfuly logged out!");
	res.redirect("/");
});




// exporting route

module.exports=router;