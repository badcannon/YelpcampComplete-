var express = require("express");
var router = express.Router({mergeParams:true});
var User = require("../models/user");
var passport = require("passport");
var campgrounds = require("../models/campgrounds");



// Landing Page !
router.get("/", function (req, res) {

    res.render("index");

});

// User Profile 
router.get("/users/:id",(req,res)=>{
   User.findById(req.params.id,(err,foundUser)=>{
    if(err){

    }
    else{
        console.log(foundUser);
        campgrounds.where('author.id').equals(foundUser._id).exec(function(err,camps){
            if(err){

            }
            console.log(camps + ":D");
            res.render("users/show",{user:foundUser,camps:camps});

        });
    }
   });
});


// ----------------------
// Authentication Routes : 
// ----------------------

router.get("/register",(req,res)=>{
    res.render("register");
});

router.post("/register",(req,res)=>{

    User.register(new User(req.body.nohash),req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){      
            res.redirect("/campgrounds");
        });
    });
 


});

//Login in :
router.get("/login",function(req,res){
     res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){
});


//Logout : 

router.get("/logout",(req,res)=>{
    req.flash("success","Logged out successfully !");
    req.logout();
    res.redirect("/");
});

module.exports = router;