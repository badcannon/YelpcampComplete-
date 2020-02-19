var express = require("express");
var router = express.Router({mergeParams:true});
var data = require("../models/campgrounds");
var commentMod = require("../models/comments");
var middleware = require("../middleware");

// ======================
//       COMMENTS 
// ======================


 
 router.post("/",middleware.isLoggedIn,function(req,res){
 
     data.findById(req.params.id , function(err,camp){
        if(err || !camp){
            req.flash("error" , "Looks like something went wrong!");
            res.redirect("/campgrounds");
           }
         else{
             commentMod.create(req.body.comment,function(err,com){
                 if(err || !com){
                     req.flash("error" , "Looks like something went wrong!");
                 res.redirect("/campgrounds");
                 }
                 else{
                    com.author.id = req.user._id;
                    com.author.username = req.user.username;
                    com.author.image = req.user.AvImage; 
                    com.save();
                    console.log("Comment Created :D")
                    camp.comment.push(com);
                     camp.save();
                     res.redirect("/campgrounds/"+camp._id);
                 }
             });
         }
 
     });
 
 });

// Edit Route :



// Update 

router.put("/:comment_id",middleware.checkOwnerCom,(req,res)=>{

    commentMod.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,com)=>{
        if(err || !com){

            req.flash("error" , "Looks like something went wrong!");
            res.redirect("back");
        }
            
        req.flash("success","Updated successfully! ");
        res.redirect("/campgrounds/"+req.params.id);
        
    });

});

// Delete Comment 
router.delete("/:comment_id",middleware.checkOwnerCom,(req,res)=>{
    commentMod.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){
            req.flash("error" , "Looks like something went wrong!");
            res.redirect("/campgrounds");        }
        else{
            req.flash("error","Deleted Successfully ! ");
            res.redirect("/campgrounds/"+req.params.id);

        }
    }) ;
});

 module.exports = router;