
// evn Stuff :D 
require('dotenv').config();


var express = require("express");
// App initialized with express !
var app = express();

app.use(express.static(__dirname + "/public"));


// Default view Engine set to ejs !
app.set("view engine", "ejs");

// setting up the body-parser

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
// Database Connectivity 
var mongoose = require("mongoose");
// This is to set new Parser UP!
mongoose.set('useNewUrlParser', true);
// This is for the new Topology Engine :
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL);

// Campgrounds model object from the campground.js file :D  
var data = require('./models/campgrounds');
// Comments
var commentMod = require('./models/comments');



// Moment Js 
app.locals.moment = require("moment");


// Passport local
var passport = require("passport");
// local strategy 
var LocalStrategy = require("passport-local");
// User Model :
var User = require("./models/user");

// flash messages 
var flash = require("connect-flash");

// flash config : 
app.use(flash());


// method override 
var methodOverride = require("method-override");

app.use(methodOverride("_method"));

// Routes : 
var campgroundRoutes = require("./routes/campgroundRoutes"),
    commentRoutes = require("./routes/commentsRoutes"),
    indexRoutes = require("./routes/indexRoutes"); 


app.use(require("express-session")({
    secret :"Hey bruh whats upppp?? LOL lamo!",
    resave : false,
    saveUninitialized : false
}));



// passport configuration : 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Userinfo Config :
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// route configs 
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

// require("./DeleteDatas")();


// Listening to the port !
if (process.env.PORT || (process.env.PORT = 3000)) {
    app.listen(process.env.PORT, process.env.IP, function () {
        console.log("Yelp Camp Started ! ");
    });
}






