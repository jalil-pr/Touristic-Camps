var express             = require("express"),
    bodyParser          = require("body-parser"),
    seedDB              =require("./seedDB"),
    Campgrounds         = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    passport            =require("passport"),
    methodOverride      =require("method-override"),
    localStrategy       =require("passport-local"),
    mongoose            = require("mongoose");


mongoose.connect("mongodb://localhost/final_camp_pract");


var app=express();
seedDB();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));


app.use(require("express-session")({
	secret:"jalil is the best programmer in the world",
	resave:false,
	saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next)
	{
		res.locals.currentUser=req.user;
		next();

	});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//////////////
// INDEX ROUT
//////////////
app.get("/",function(req,res)
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



/////////
// CREATE ROUUTES
/////////
app.get("/campground/new",function(req,res)
{
	//res.render("new");
    res.render("new");
});


app.post("/campground",function(req,res)
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
app.get("/campground/:id",function(req,res)
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
app.get("/campground/:id/edit",function(req,res)
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
app.put("/campground/:id",function(req,res)
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

app.delete("/campground/:id",function(req,res)
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
app.get("/campground/:id/comment/new",isLoggedIn , function(req,res)
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
app.post("/campground/:id/comment",function(req,res)
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


/////////
/// SIGN UP ROUTES
/////////
app.get("/register",function(req,res)
{
	res.render("auth/register");

});

app.post("/register",function(req,res)
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


////////////////
// LOGIN ROUTES
///////////////
app.get("/login",function(req,res)
{

	res.render("auth/login");

});

app.post("/login",passport.authenticate("local",{
	successRedirect:"/",
	failureRedirect:"/login"
}),function(req,res)
{

});

app.get("/logout",function(req,res)
{
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req,res,next)
{
	if(req.isAuthenticated())
	{
		return next();
	}	
	res.redirect("/login");
}



app.listen(3000,function()
{
	console.log("server has started.");
});
// test the edit rout and fix the problem,
// add one more route and push it to the github
