//including the mongoose module
var mongoose = require('mongoose');
//accessing the Schema
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    
    title : {type: String, default:'', required: true,unique: true},
    subTitle : {type: String, default:''},
    tags : [],
    created : {type: Date},
    lastModified : {type: Date},
    authorInfo : {fullName: String, email: String},
    content : {type: String,default: ''}
                            
});

mongoose.model('Blog',blogSchema);