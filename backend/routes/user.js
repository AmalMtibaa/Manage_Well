var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var User = require('../model/user.model');
var Task = require("../model/task.model");


/* POST sujets to DB. */
router.post('/add', function(req, res, next) {

    var myUser = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        type: req.body.type,
        poste: req.body.poste,
        taskId:[]
    });


    myUser.save()
        .then(function () {
            User.find({})
                .exec(function(err, data) {
                    console.log(data);
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    res.status(200).json(data);
                });
        });
});

router.get('/all', function(req, res, next) {
    console.log(req.body);
    User.find({})
        .exec(function(err, data) {
        console.log(data);
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(200).json(data);
    });
});

router.get('/userTasks/:idUser',function(req, res, next) {
    User.find({
        _id:req.params.idUser
    }).exec(function(err1, data1) {
        Task.find({
            _id: {$in: data1[0].taskIds}
        })
            .exec(function(err, data) {
            console.log(data1);
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json(data);
        });
    });
});

router.post('/allUsersWorkedHours',function(req, res, next) {
    var startDate=req.body.startDate;
    var endDate=req.body.endDate;

    console.log(startDate);
    console.log(endDate);


    var start = new Date(2018, 07, 30);
    var end = new Date(2018, 08, 02);

    var usersWorkedHours=[];
    User.find({})
        .forEach(function (err,user) {
            console.log("--------");
          //for(var i=0;i<usersList.length;i++){


                var idSelectedUser=user._id;
                var workedHoursForSelectedUser=[];


                Task.find({_id : {$in:user.taskIds}})
                    .exec(function (er,tasksList) {
                        /*console.log(tasksList);*/

                        /*for(var j=0;j<tasksList.length;j++){
                            for(var k=0;k<tasksList[j].usersWorkedHours.length;k++){
                                /!*console.log("--------------------tasksList[j].usersWorkedHours[k]--------");
                                console.log(tasksList[j].usersWorkedHours[k]);*!/
                                console.log("-------Worked Hours-----    " + "j ="+j);
                                if(tasksList[j].usersWorkedHours[k].idUser.toString()===idSelectedUser.toString()){
                                   /!* console.log('We are inside the if');
                                    console.log(JSON.stringify(tasksList[j].usersWorkedHours[k].workedHours));*!/

                                    for(var a=0;a<tasksList[j].usersWorkedHours[k].workedHours.length;a++){

                                        console.log(tasksList[j].usersWorkedHours[k].workedHours[a]);
                                        workedHoursForSelectedUser.push(tasksList[j].usersWorkedHours[k].workedHours[a]);

                                    }


                                }
                                console.log("_______ end Iterator of Each usersWorkedHours of Each task");
                            }
                        }

                        console.log("....workedHoursForSelectedUser..");
                        console.log(workedHoursForSelectedUser);

                        var totalWorkedHours=0;
                        for(var z=0;z<workedHoursForSelectedUser.length;z++){

                            //if(workedHoursForSelectedUser.workedHours[z].date>=start && workedHoursForSelectedUser.workedHours[z].date<=end){
                            totalWorkedHours+=workedHoursForSelectedUser[z].workedHoursByDay;

                            //}
                        }
                        console.log("--------totalWorkedHours");
                        console.log(totalWorkedHours);
                        usersWorkedHours.push(totalWorkedHours);
                        console.log("#################################### end Iterator of Each User  " );
                    });*/
              /*  }*/
        });/*
        .then(function () {
        console.log("------              usersWorkedHours     ------");
        console.log(usersWorkedHours);
    });*/

});
});

router.get('/delete/:idUser', function(req, res, next) {

    User.deleteOne({
        _id: req.params.idUser
    })
        .then(function () {
            User.find({})
                .exec(function(err, data) {
                    console.log(data);
                    if (err) {
                        return res.status(500).json({
                            title: 'An error occurred',
                            error: err
                        });
                    }
                    res.status(200).json(data);
                });
        });
});


module.exports = router;