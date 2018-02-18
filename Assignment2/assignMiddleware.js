module.exports = function(router){
    
    router.use(function(req,res,next){
        var today = new Date();
        console.log("Viewed all blogs at: "+today);
        next();
    });
    
}


