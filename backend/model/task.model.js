var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name:String,
    status:Boolean,
    duration:Number,
    creationDate:Date,
    deadline:Date,
    projectId:String,
    usersWorkedHours:
        [
            {idUser:String,
            workedHours:[{
                            date:Date,
                            workedHoursByDay:Number
                        }]
            }]
});

module.exports = mongoose.model('Task', schema);