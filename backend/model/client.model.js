var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name:String,
    description :String,
    projectsID :[String]
});

module.exports = mongoose.model('Client', schema);