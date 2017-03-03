var User = require('../models/user'); //import the user model
var jwt = require('jsonwebtoken');
var secret = 'LanaDelRey';
var multer = require('multer');

//multer stuff, to upload a file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'_'+file.originalname);
  }
});

var upload = multer({ 
    storage: storage
}).single('myfile');


//Routes
//create a route for users to register, to enter the data to the DB
//http://localhost:8080/api/users
//new user registeration route
module.exports = function(router){
	router.post('/users', function(req, res){
	//res.send('Queen Lana says Hello from users route');
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;
	user.email = req.body.email;
    user.firstName = "firstNameTemp";
    user.lastName = "lastNameTemp";
    user.description = "descriptionTemp";
    user.links =  [];
    user.linksNames =  [];
    user.isEmpty = true;
    user.screenshots = [];
    user.profilePicture = 'uploads/images/default.jpg';
    user.works = [];
    user.reps = [];
	if(req.body.username==null || req.body.username == '' || req.body.password==null || req.body.password == '' || req.body.email==null || req.body.email == ''){
		res.json({success:false, message: 'The fields {Username, Password, Email} are required!'})
	}
	else{
		user.save(function(err){
		if(err){
            console.log(err);
			res.json({success:false, message: 'Username or Email is already used!'})
		}
		else{
			res.json({success:true, message: 'User Created!'})
		}
        });
	}
    });


    // geting all portfolios route
    router.get('/getPorts', function(req, res){
        User.find({isEmpty:false}, function(err, users){
            if(err){
                console.log(err.message);
            }
            if(!users){
                res.json({success: false, message:'Users not found'});
            }
            else{
                res.json({success: true, users: users});
            }


        });
    });


    router.get('/viewPort/:id', function(req, res){
        var name =  req.params.id;
        User.findOne({username:name}, function(err, user){
            if(err){
                //throw err;
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message: 'No user was found'});
            }
            else{
                res.json({success: true, links: user.links, user: user});   
            }
        });
    });


	//login route
	//http://localhost:8080/api/authenticate
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) {
                console.log(err);
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'The username you entered does not match any account!' });
                } else if (user) {
                    if (req.body.password) {
                        //var validPassword = user.comparePassword(req.body.password);
                        var validPassword = user.password==req.body.password;
                        if (!validPassword) {
                            res.json({ success: false, message: 'The password you entered is incorrect!' });
                        } else {
                        	//provide a tokken(session) to the logged in user
                        	var token = jwt.sign({username: user.username, email:user.email}, secret, { expiresIn: '24h'});
                            res.json({ success: true, message: 'Successfully logged in.', token: token });
                        }
                    } else {
                    	jwt
                        res.json({ success: false, message: 'No password provided!' });
                    }
                }
            }
        });
    });﻿

    //to get a tokken decrypted and send it back to the user below, create a middleware
    router.use(function(req, res, next){
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, secret, function(err, decoded){
                if(err){
                    res.json({success: false, message: 'Session Expired!'});
                } else{
                    req.decoded = decoded;
                    next();
                }
            });
        } else{
            res.json({success: false, message: 'Session Error!'});
        }
    });


    //current user route
    router.post('/me', function(req, res){
        res.send(req.decoded);
    });


    router.get('/links', function(req, res){
        User.findOne({username:req.decoded.username}, function(err, user){
            if(err){
                //throw err;
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message: 'No user was found'});
            }
            else{
                res.json({success: true, links: user.links, name: user.firstName+" "+user.lastName, linksNames:user.linksNames, description:user.description, screenshots: user.screenshots , profilePicture:user.profilePicture, reps:user.reps});   
            }
        });
    });


    router.get('/isEmptyStatus', function(req, res){
        User.findOne({username:req.decoded.username}, function(err, user){
            if(err){
                //throw err;
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message: 'No user was found'});
            }
            else{
                res.json({success: true, isEmpty: user.isEmpty});   
            }
        });
    });




    router.get('/getDescription', function(req, res){
        User.findOne({username:req.decoded.username}, function(err, user){
            if(err){
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message:'Description not found'});
            }
            else{
                res.json({success: true, description: user.description});
            }


        });
    });


    router.get('/getLinksNames', function(req, res){
        User.findOne({username:req.decoded.username}, function(err, user){
            if(err){
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message:'LinksNames not found'});
            }
            else{
                res.json({success: true, linksNames: user.linksNames});
            }


        });
    });

    //http://localhost:8080/api/createPort
    router.get('/createPort', function(req, res) {
        User.findOne({ username:req.decoded.username }, function(err,user){
            if(err){
                console.log(err);
            }
            else{
                if(!user){
                    res.json({success: false, message:'Can not create portfolio, No user found!'});
                }
                else{
                    res.json({success: true, user:user});
                }
            }
        });
    });﻿


    router.put('/createPortf', function(req,res){
        var editFirstName = req.body.firstName;
        var editLastName = req.body.lastName;
        var editDescription = req.body.description;
        var editLink =  req.body.link;
        var editIsEmpty = false;
        User.findOne({ username:req.decoded.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else{
            user.firstName = editFirstName;
            user.lastName = editLastName;
            user.description = editDescription;
            user.links.push(editLink);
            user.works.push(editLink);
            user.isEmpty = editIsEmpty;
            // Save changes
            user.save(function(err) {
                if (err) {
                    console.log(err); // Log error to console
                } 
                else {
                    res.json({ success: true, message: 'Portfolio has been created' }); // Return success
                }
            });

        }
        });
    });



    router.put('/addLink', function(req,res){
        var newLink =  req.body.link;
        var dup = false;
        User.findOne({ username:req.decoded.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else{
            if(user.links.indexOf(newLink)>=0){
                dup = true;
            }
            else{
                user.links.push(newLink);
                user.works.push(newLink);
            }

            // Save changes
            user.save(function(err) {
                if (err) {
                    console.log(err); // Log error to console
                } 
                else {
                    if(!dup){
                        res.json({ success: true, message: 'Link has been added' }); // Return success
                    }
                    else{
                        res.json({ success: false, message: 'Link has been inserted before!' }); // Return success
                    }
                    
                }
            });

        }
        });
    });


    
    router.put('/addRep', function(req,res){
        var newRep =  req.body.rep;
        var dup = false;
        User.findOne({ username:req.decoded.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else{
            if(user.reps.indexOf(newRep)>=0){
                dup = true;
            }
            else{
                user.reps.push(newRep);
            }
            // Save changes
            user.save(function(err) {
                if (err) {
                    console.log(err); // Log error to console
                } 
                else {
                    if(!dup){
                        res.json({ success: true, message: 'Code Repository was added successfully!' }); // Return success
                    }
                    else{
                        res.json({ success: false, message: 'This piece of code has been inserted before!' }); // Return success
                    }
                    
                }
            });

        }
        });
    });    


    router.post('/upload', function (req, res) {
        upload(req, res, function (err) {
        if (err) {
            console.log(err);
            res.json({success:false, message: 'File Upload Error!'});
        }
        else{
            if(!req.file){
                res.json({success:false, message: 'No file was selected!'});
            }
            else{
                res.json({success:true, message: 'Your picture was uploaded successfully!'});
            }

        }

      });
    });


    router.put('/setPP', function(req,res){
        var newPP =  req.body.path;
        User.findOne({ username:req.decoded.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else{
            user.profilePicture = newPP;
            // Save changes
            user.save(function(err) {
                if (err) {
                    console.log(err); // Log error to console
                } 
                else {
                    res.json({ success: true, message: 'Your new picture was uploaded successfully', profilePicture:user.profilePicture}); // Return success
                }
            });

        }
        });
    });


    router.get('/allData', function(req, res){
        var name =  req.body.username;
        User.findOne({username:'sia'}, function(err, user){
            if(err){
                //throw err;
                console.log(err.message);
            }
            if(!user){
                res.json({success: false, message: 'No user was found'+name});
            }
            else{
                res.json({success: true, links: user.links, name: user.firstName+" "+user.lastName, description:user.description, screenshots: user.screenshots, profilePicture: user.profilePicture});   
            }
        });
    });


    router.put('/addScreenshot', function(req,res){
        var newScreenshot =  req.body.screenshot;
        User.findOne({ username:req.decoded.username }, function(err, user) {
        if (err) {
            console.log(err);
        }
        else{
            user.screenshots.push(newScreenshot);
            user.works.push(newScreenshot);
            // Save changes
            user.save(function(err) {
                if (err) {
                    console.log(err); // Log error to console
                } 
                else {
                    res.json({ success: true, message: 'Screenshot has been added' }); // Return success
                }
            });

        }
        });
    });





	return router;

}