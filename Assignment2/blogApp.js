// Including required modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
require('./assignMiddleware.js')(router); //importing the file assignMiddleware.js
app.use(bodyParser.json({limit:'10mb',extended: true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended: true}));

app.use(function(err,req,res,next){
    res.status(404).send(err.message);
    next();
});

var dbPath = 'mongodb://localhost/myBlogApplication';

mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
    console.log('Connection has been established with MongoDB');
});

var Blog = require('./blogModel.js'); //importing the file blogModel.js

var blogModel = mongoose.model('Blog');

app.get('/', function(req,res){
   res.send('Hello!!! Welcome to Blog application.\n Share your Ideas or thoughts by creating your own blog!!!! It\'s simple');
});

/////////////////////////////////////////////////////////////////
//read a blog using its id

app.get('/blog/:id/read',function(req,res,next){
    
        blogModel.findOne({'_id':req.params.id}, function(err,result){
        if(err){
            console.log(err);
            err = new Error("Searched Blog ID doesn't exist"); //if searched id doesn't exist at all
            next(err);
        }
        else{
            if(result == null){
                err = new Error("Searched Blog ID doesn't exist"); //searched for deleted ID
                next(err);
            }
            else{
                console.log(result);
                res.send(result);
            }
        }
    });
});

/////////////////////////////////////////////////////////////////
//delete the specified blog

app.post('/blog/:id/delete',function(req,res,next){
    
    blogModel.remove({'_id':req.params.id},function(err,result){
        if(err){
            console.log(err);
            err = new Error("The Blog you want to delete, does not exists at all. Kindly recheck it"); // Searched with the ID which doesn't                                                                                                // exist at all
            next(err);
        }
        else if(result.n>0){
            console.log(result);
            res.send("Deleted Successfully"); //if deleted successfully
        }
        else{
            res.send("Nothing to delete"); //searched with already deleted id
        }
    });
});

/////////////////////////////////////////////////////////////////
//update or edit any details in blog

app.put('/blog/:id/edit',function(req,res,next){
    
    update = req.body;
    blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
        if(err){
            console.log(err);
            err = new Error("Searched Blog ID doesn't exist"); //if searched with the ID which doesn't exist at all
            next(err);
        }
        else{
            var modi = new Date();
            result.lastModified = modi; //updates with the last modified date
            res.send(result);
        }
    });
});

/////////////////////////////////////////////////////////////////
//reading all the existing blogs

app.get('/blogs',router,function(req,res){
    blogModel.find(function(err,result){
        if(err){
            res.send(err);
        }
        else{
            res.send(result);
        }
    });
});

/////////////////////////////////////////////////////////////////
//create a new blog

app.post('/blog/create',function(req,res,next){
    
    var newBlog = new blogModel({
        
        title: req.body.title,
        subTitle : req.body.subTitle,
        content : req.body.content
        
    });
    
    //var title = req.body.title;
    //var newBlogs = [];
    
    var today = new Date();
    newBlog.created = today;
    
    newBlog.lastModified = today;
    
    var tags = (req.body.tags!=undefined && req.body.tags!=null)?req.body.tags.split(','):''
    newBlog.tags = tags;
    
    var authorInfo = {fullName: req.body.fullName,email: req.body.email};
    newBlog.authorInfo = authorInfo;
    
    newBlog.save(function(err,result){
        if(err){
            console.log(err);
            if(err.errors.title.message === "Path `title` is required."){
                var err1 = new Error ("Please Name your Blog..it is required!!");
                next(err1);
            }
            else{
                res.send(err);
            }
            
        }
        else{
            console.log(result);
            res.send(result);
        }
    });
});
/////////////////////////////////////////////////////////////////

app.get('*',function(req,res,next){
    var err = new Error("Please check the path correctly!!"); //tells about the path specified
    next(err);
});

app.post('*',function(req,res,next){
    var err = new Error("Please check the path correctly!!"); //tells about the path specified
    next(err);
});

app.put('*',function(req,res,next){
    var err = new Error("Please check the path correctly!!"); //tells about the path specified
    next(err);
});

app.use(function(err,req,res,next){
    res.status(404).send(err.message);
});

app.listen(3000,function(){
    console.log('Listening on port 3000');
});
        