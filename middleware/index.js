var data = require("../models/campgrounds");
var commentMod = require("../models/comments");


var middleware = {};

middleware.checkOwnerCom = function(req,res,next){
    if(req.isAuthenticated()){
       data.findById(req.params.id , (err,camp )=>{
           if(err || !camp){
            req.flash("error","Looks like that campground does not exist !");
            res.redirect("back");
           }
           else{
            commentMod.findById(req.params.comment_id,(err,com)=>{
                if(err || !com){
                 req.flash("error","Looks like that comment does not exist !");
                    res.redirect("back");
                }
                else{
                    if(com.author.id.equals(req.user._id)){
                        next();
                    }
                    else{
                     req.flash("error","You dont have the permission to do that ! ");
                        res.redirect("back");
                    }
                }
            });

           }

       });
     
    }
    else{
        req.flash("error","You must be logged in to do that !");
        res.redirect("back");
    }
}


middleware.checkOwner = function(req,res,next){
     if(req.isAuthenticated()){
        data.findById(req.params.id,(err,camp)=>{
            if(err || !camp){
                req.flash("error","looks like something went wrong !");
                res.redirect("back");
            }
            else{
                if(camp.author.id.equals(req.user._id)){
                    
                    next();
                }
                else{
                    req.flash("error","You dont have the permission to do that ! ");
                    res.redirect("back");
                }
            }
        })

    }
    else{
        req.flash("error","You must be logged in to do that !");
        res.redirect("back");
    }
}


middleware.isLoggedIn = function(req,res,next){
    console.log(req.isAuthenticated())
     if(req.isAuthenticated()){
         return next();
     }
     else{
         req.flash("error","You must be logged in to do that !");
         res.redirect("/login");
     }
 }

middleware.isLiked = function (req,res,next){

    data.findById(req.params.id,(err,camp)=>{
        if(err){
            console.log("Error");

        }
        else {
            if(camp.likes){
                camp.likes.forEach( like=> {

                    if(req.user_id.equals(like.id)){
                        return req.redirect("back");
                    }
                    else {
                        next();
                    }
                    
                });

            }
            else {
                next();
            }
        }
    });

}


module.exports = middleware;