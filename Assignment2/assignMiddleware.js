module.exports = function(router){
    
    router.use(function(req,res,next){
        var today = new Date();
        console.log("Viewed today at: "+today);
        next();
    });
    
}