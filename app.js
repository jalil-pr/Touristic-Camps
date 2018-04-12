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


var indexRoutes = require("./routes/index");
var commentsRoutes =require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");


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


app.use(indexRoutes);
app.use(commentsRoutes);
app.use(campgroundRoutes);



passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());










app.listen(3000,function()
{
	console.log("server has started.");
});
// test the edit rout and fix the problem,
// add one more route and push it to the github
