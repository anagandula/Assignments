module.exports = function(router){
    
    router.use(function(req,res,next){
        var today = new Date();
        console.log("All blogs are seen Today at: "+today);
        next();
    });
}