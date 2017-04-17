//packages
var express = require('express');
var app = express();
var morgan = require('morgan');    //Morgan is a HTTP request logger middleware for Node.js
var mongoose = require('mongoose'); //Mongoose is a handler for MangoDB and Node.js
var bodyParser = require('body-parser'); //an Express middleware to parse data to the DB
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
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



//middleware
//the way any middleware is used, all middlewares run before the rest of the code
app.use(morgan('dev'));// logs any request made to the server
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended:true})); //for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname+'/public')); //provide the front-end with access to the dir public
app.use(express.static(__dirname+'/uploads/images'));
//data should be parsed first, order is important
app.use('/api', appRoutes);
//background routes
//http://localhost:8080/api/users

/*app.get('/', function(req, res){
	res.send('Queen Lana says Hi');
})//this is used to test a route in the browser*/ 

/*app.get('/home', function(req, res){
	res.send('Queen Lana says Hello from home');
})//this is used to test the logging functionality*/ 


//MongoDB connection
mongoose.connect('mongodb://localhost:27017/portfoliodb', function(err){
	if(err){
		console.log("Queen Lana is asleep, come back later, "+err);
	}else{
		console.log("Queen Lana welcomes you to MongoDB");
	}
});


// the upload route
app.post('/upload', function (req, res) {
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
    		res.json({success:true, message: 'File was uploaded successfully!', path: req.file.path, name: req.file.filename});
    	}

    }

  });
});




//to send users to main page
app.get('*', function(req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})


//first thing: run the server on port: 8080
app.listen(process.env.PORT || 8000, function(){
	console.log('Server QueenLana is Online!')
});










