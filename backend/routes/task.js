var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var Task = require('../model/task.model');
var User = require('../model/user.model');
var Client=require('../model/client.model');

router.post('/add', function(req, res, next) {

    var myTask = new Task({

        name: req.body.name,
        status: req.body.status,
        duration: req.body.duration,
        creationDate: req.body.creationDate,
        deadline: req.body.deadline,
        projectId: req.body.projectId,
        usersWorkedHours: req.body.usersWorkedHours

    });

    myTask.save(function (er,dt) {

        var result=[];
        for(var i=0;i<req.body.usersWorkedHours.length;i++) {
          result.push(req.body.usersWorkedHours[i].idUser);
        }
        var obj_ids = result.map(function(id) { return mongoose.Types.ObjectId(id); });

            User.updateMany(
                {_id: {$in: obj_ids}}
                ,
                {
                    $push: {
                        taskIds: dt._id
                    }
                })
                .then(function (err, data1) {
                    console.log(data1);
                    Task.find({})
                        .exec(function(err, data) {
                            //console.log(data);
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

});

router.get('/projectTasksList/:idProject',function (req,res,next) {
    Task.find({projectId: req.params.idProject})
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

router.post('/projectTasksListByUser',function (req,res,next) {
    var tasksListByProject=[];
    Task.find({projectId:{$in :req.body.idProject}})
        .exec(function(err, tasksList) {
            for(var i=0;i<tasksList.length;i++){
                for(var j=0;j<tasksList[i].usersWorkedHours.length;j++){
                    if(req.body.idUsers.includes(tasksList[i].usersWorkedHours[j].idUser)){
                        tasksListByProject.push(tasksList[i].usersWorkedHours[j].workedHours);
                    }
                }
            }
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json(tasksListByProject);

        });
});

//to get the task of all the projects of a specific client
router.get('/clientTasksList/:idClient',function (req,res) {
    Client.find({_id:req.params.idClient})
        .exec(function(err1, data1) {
            Task.find({projectId: {$in :data1[0].projectsID}})
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

router.post('/delete', function(req, res, next) {

    var result=[];
    for(var i=0;i<req.body.usersWorkedHours.length;i++) {
        result.push(req.body.usersWorkedHours[i].idUser);
    }
    var obj_ids = result.map(function(id) { return mongoose.Types.ObjectId(id); });



    Task.deleteOne({
        _id: req.body._id
    })
        .then(User.updateMany(
                {_id: {$in: obj_ids}}
            ,
            {
                $pull:{
                    taskIds:req.body._id
                }
            })

            .exec(function(err, data) {
                console.log(data);
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(200).json(data);
            }));
});

router.post('/update', function(req, res, next) {
    console.log(req.body);
    var status=false;
    if(req.body.status==='Open'){
        status=true;
    }
    Task.updateOne({
            _id:req.body._id
        },
        {
            name:req.body.name,
            duration:req.body.duration,
            status:status,
            deadline:req.body.deadline
        })
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

router.get('/all', function(req, res, next) {

    Task.find({})
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

router.post('/saveWorkTask', function(req, res, next) {
    console.log(req.body.idUser);
    console.log(req.body.workedHours);
    var cpt = 0;
    var exact = 0;
    for (cpt = 0; cpt < req.body.workedHours.length; cpt++) {
        Task.update({
            _id: req.body.workedHours[cpt].idTask
        }, {
            $push: {
                "usersWorkedHours.$[elem].workedHours": req.body.workedHours[cpt].work
            }
        }, {
            multi: true,
            arrayFilters: [{
                "elem.idUser": req.body.idUser
            }]
        })
            .exec(function(err, data) {
            if (err = null) {
                exact++;
            }
        });
    }
   /* if (exact == req.body.workedHours.length) {
        res.status(200).json({
            message: 'The update is successfully done'
        });
    } else {
        return res.status(500).json({
            message: 'An error occurred in the update'
        });
    }*/
});



module.exports = router;