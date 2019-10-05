var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    nom: String,
    prenom: String,
    email: String,
    type: String,//Admin normall..
    poste: String,
   // projectsId:[String] //list of projects Id that----------------Going to remove it
    taskIds:[String]
});

module.exports = mongoose.model('User', schema);