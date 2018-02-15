// Including required modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
require('./assignMiddleware.js')(router);
app.use('/blogs',router);

app.use(bodyParser.json({limit:'10mb',extended: true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended: true}));

var dbPath = 'mongodb://localhost/myBlogApplication';

mongoose.connect(dbPath);

mongoose.connection.once('open',function(){
    console.log('Connection has een established with MongoDB');
});

var Blog = require('./blogModel.js');

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
            err = new Error("Searched Blog ID doesn't exist");
            next(err);
        }
        else{
            if(result == null){
                err = new Error("Searched Blog ID doesn't exist");
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
            err = new Error("The Blog you want to delete, does not exists at all. Kindly recheck it");
            next(err);
        }
        else if(result.n>0){
            console.log(result);
            res.send("Deleted Successfully");
        }
        else{
            res.send("Nothing to delete");
        }
    });
});

/////////////////////////////////////////////////////////////////
//update or edit any details in blog

app.put('/blog/:id/edit',function(req,res){
    
    update = req.body;
    console.log(req.authorInfo.fullName+" made this request");
    blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
        if(err){
            console.log(err);
            res.send(err);
        }
        else{
            console.log(result);
            res.send(result);
        }
    });
});

/////////////////////////////////////////////////////////////////
//reading all the existing blogs

app.get('/blogs',function(req,res){
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
    
    var today = new Date();
    newBlog.created = today;
    
    newBlog.lastModified = today;
    
    var tags = (req.body.tags!=undefined && req.body.tags!=null)?req.body.tags.split(','):''
    newBlog.tags = tags;
    
    var authorInfo = {fullName: req.body.authorFullName,email: req.body.authorEmail};
    newBlog.authorInfo = authorInfo;
    
    newBlog.save(function(err,result){
        if(err){
            console.log(err);
            if(req.body.title == null){
                err = new Error("Blog title is required field. Please name your Blog!!");
                next(err);
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
    var err = new Error("Please check the path correctly!!");
    next(err);
});

app.use(function(err,req,res,next){
    res.status(404).send(err.message);
    next();
});

app.listen(3000,function(){
    console.log('Listening on port 3000');
});
        