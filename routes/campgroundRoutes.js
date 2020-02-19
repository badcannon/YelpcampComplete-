var express = require("express");
var router = express.Router({mergeParams:true});
var data = require("../models/campgrounds");
var comment = require("../models/comments");
var middleware = require("../middleware");

// geocoder :
var NodeGeocoder = require("node-geocoder");

var Options= {
    provider: 'mapquest',
    apiKey:  process.env.API_KEY
};

var geocoder = NodeGeocoder(Options);

// Multer and Cloudinary :
var multer = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);}
 });

var imageFilter = function(req,file,callback){
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
}

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'yelpcamp4318', 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_KEY_SECRET
});

// campgrounds page !
router.get("/", function (req, res) {
 if(req.query.search){
     const regexSearch = new RegExp(escapeRegex(req.query.search),"gi");
    data.find({name:regexSearch}).populate("comment").exec(function (err, campgroundsAll) {
        if (err) {
             req.flash("error","Looks like something went wrong!");
             return res.redirect("/campgrounds");
        } else {
            if(campgroundsAll.length < 1){
                req.flash("error","Looks like something went wrong!");  
                return   res.redirect("/campgrounds");
            }
            
           return res.render("campgrounds/campgrounds", {
                campgrounds: campgroundsAll
            });
        }

    });


        }   
 else{ 
    data.find({}).populate("comment").exec(function (err, campgroundsAll) {
        if (err) {
             req.flash("error","Looks like something went wrong!");
             res.redirect("/");
        } else {
            
            res.render("campgrounds/campgrounds", {
                campgrounds: campgroundsAll
            });
        }

    });
  }

});


// Following the restful routing !

router.post("/",middleware.isLoggedIn,upload.single('image'), function (req, res) {
    var newCampground = req.body.campground;
    console.log(req.body.campground);

    // Saving in the db :
    data.create(newCampground, function (err, camp) {
        if (err || !camp) {
            req.flash("error","Looks like something went wrong!");
            res.redirect("/");
        } else {

            console.log(req.file.path);
            cloudinary.v2.uploader.upload(req.file.path, function(error,result) {
                if(error){
                    console.log(error);
                }
                camp.author.id = req.user._id;
                camp.author.username = req.user.username;
                camp.author.image = req.user.AvImage;
                camp.image  = result.secure_url;
                camp.imageID = result.public_id;
                geocoder.geocode(camp.location,(err,locationData)=>{
                    if(err){
                                // req.flash("success","Campground added Successfully ");
                                // res.redirect("/campgrounds");
                    }
                    else{
                        camp.longitude = locationData[0].longitude;
                        camp.latitude = locationData[0].latitude;
                        camp.location = locationData[0].formattedAddress;
                        camp.save((err,savedCamp)=>{
                            if(err){
                                // req.flash("success","Campground added Successfully ");
                                // res.redirect("/campgrounds");
                            }
                            req.flash("success","Campground added Successfully ");
                            res.redirect("/campgrounds");
                        });
                    }
                });
                
            });
           
           
        }      
               
        });
        });
 



// following the restful routing with emphasis given on curd !
router.get("/new",middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


// To show the data : 

router.get("/:id", function (req, res) {
    var id = req.params.id;
    console.log(id);
    data.findById(id).populate("comment").exec( function (err, data) {
        if (err || !data) {
            req.flash("error","Campground not found! ");
            res.redirect("/campgrounds");

        } else {
            console.log(data);
              
               res.render("campgrounds/show", {
                data: data
            });
          
        }
    })
       
});

// Edit Route : 

router.get("/:id/edit",middleware.checkOwner,(req,res)=>{

    data.findById(req.params.id,(err,camp)=>{
        if(err || !camp){
            req.flash("error","Campground not found !");
            res.redirect("/campgrounds");

        }
        else{
            res.render("campgrounds/edit",{
                camp : camp
            });
        }
    });

});

// Update Route

router.put("/:id",middleware.checkOwner,upload.single('image'),(req,res)=>{
           
        data.findById(req.params.id, async function(err, campground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } 
            else{
            if(req.body.campground.location === campground.location){
              
                if (req.file) {
                    try {                      
                        await cloudinary.v2.uploader.destroy(campground.imageID);
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                         campground.imageId = result.public_id;
                        campground.image = result.secure_url;
                        campground.name = req.body.campground.name;
                        campground.description = req.body.campground.description;
                        campground.price = req.body.campground.price;
                        campground.save();
                        req.flash("success","Successfully Updated!");
                        res.redirect("/campgrounds/" + campground._id);
  
                    } catch(err) {
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                  }
                  else{
                    campground.location = campground.formattedAddress;
                    campground.latitude = campground.latitude;
                    campground.longitude = campground.longitude;
                    campground.imageId = campground.public_id;
                    campground.image = campground.secure_url; 
                  campground.name = req.body.campground.name;
                  campground.description = req.body.campground.description;
                  campground.price = req.body.campground.price;
                  campground.save();
                  req.flash("success","Successfully Updated!");
                  res.redirect("/campgrounds/" + campground._id);
                  
                }
            }
            else{
                console.log(req.file);
                if (req.file) {
                  try {                      
                      await cloudinary.v2.uploader.destroy(campground.imageID);
                      var result = await cloudinary.v2.uploader.upload(req.file.path);
                      var locationData = await geocoder.geocode(req.body.campground.location);
                      campground.imageId = result.public_id;
                      campground.image = result.secure_url;
                      campground.location = locationData.formattedAddress;
                      campground.latitude = locationData.latitude;
                      campground.longitude = locationData.longitude;
                      campground.name = req.body.campground.name;
                      campground.description = req.body.campground.description;
                      campground.price = req.body.campground.price;
                      campground.save();
                      req.flash("success","Successfully Updated!");
                      res.redirect("/campgrounds/" + campground._id);

                  } catch(err) {
                      req.flash("error", err.message);
                      return res.redirect("back");
                  }
                }
                else{
                var locationData = await geocoder.geocode(req.body.campground.location);
                campground.location = locationData.formattedAddress;
                campground.latitude = locationData.latitude;
                campground.longitude = locationData.longitude;
                campground.imageId = campground.public_id;
                campground.image = campground.secure_url;    
                campground.name = req.body.campground.name;
                campground.description = req.body.campground.description;
                campground.price = req.body.campground.price;
                campground.save();
                req.flash("success","Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        }
        }
        });
        });

// Delete Route 

router.delete("/:id",middleware.checkOwner,(req,res)=>{
    data.findById(req.params.id,(err,camp)=>{
        if(err || !camp){
            console.log(err);
        }
        else{
             for (com of camp.comment){
                comment.findByIdAndDelete(com,(err)=>{
                    if(err){
                        console.log("Error");
                    }
                    console.log("Comment deleted!");
                });
             }
             cloudinary.v2.uploader.destroy(camp.imageID,(err)=>{
                    if(err){
                        console.log(err.message);
                        
                    }
                    else{
                        data.findByIdAndDelete(req.params.id,(err)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Campground Deleted!");
                                req.flash("error","Deleted Successfully!");
                                res.redirect("/campgrounds");
                            }
                        });   

                    }
             });
            }
    });
 
});



// Likes : 

router.post("/:id/likes",middleware.isLiked,(req,res)=>{
    
    data.findById(req.params.id,(err,camp)=>{
        if(err){

        }
        else {
            var Id = req.user._id;
            var count = 1;

            if(camp.likes){
                camp.likes.push({
                    id : req.user._id
                })

            }
        }
    });

 });


// Regex 
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;