//including the mongoose module
var mongoose = require('mongoose');
//accessing the Schema
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    
    title : {type: String, default:'', required: true},
    subTitle : {type: String, default:''},
    tags : [],
    created : {type: Date},
    lastModified : {type: Date},
    authorInfo : {},
    content : {type: String,default: ''}
                            
});

mongoose.model('Blog',blogSchema);