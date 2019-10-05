var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name:String,
    duration :Number,
    startDay :Date,
    deadline :Date,
    client :String,
    status:String
});

module.exports = mongoose.model('Project', schema);