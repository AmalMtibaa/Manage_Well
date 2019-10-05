var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var Project = require('../model/project.model');
var Client=require('../model/client.model');
var Task=require('../model/task.model');
var User=require('../model/user.model');


/* POST sujets to DB. */
router.post('/ajout', function(req, res, next) {

    var myProject = new Project({
        name: req.body.name,
        duration: req.body.duration,
        startDay: req.body.startDay,
        deadline: req.body.deadline,
        client: req.body.client,
        status:req.body.status
    });

   myProject.save(function (er,dt) {

           Project.find({})
               .exec(function(err, data) {

                   if (err) {
                       return res.status(500).json({
                           title: 'An error occurred',
                           error: err
                       });
                   }
                   res.status(200).json(
                       {
                           message: 'SavedProject',
                           projects: data,
                           result:dt
                       }
                   );
               });
       });
});

router.get('/all', function(req, res, next) {
    console.log(req.body);
    Project.find({})
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

router.post('/some', function(req, res, next) {
    var obj_ids = req.body.map(function(id) { return mongoose.Types.ObjectId(id); });

    Project.find({_id: {$in: obj_ids}})
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
}); //To get ProjectName by list of IDS

router.get('/delete/:idProject/:clientName', function(req, res, next) {

    Project.deleteOne({
        _id: req.params.idProject
    })
        .then(Client.updateOne({
                name:req.params.clientName
            },
            {
                $pull:{
                    projectsID:req.params.idProject
                }
            })
            .then(
                Task.find({
                    projectId:req.params.idProject
                })
                    .exec(function (err1, data1) {
                        //the list of Tasks Id that we are going to delete
                        var tasksId=[];
                        var i;
                        for(i=0;i<data1.length;i++){
                            tasksId.push(data1[i]._id);
                        }
                        //list of id Users that Worked on those Tasks
                        var testUsers=[];
                        for(i=0;i<data1.length;i++){

                            for(var j=0;j<data1[i].usersWorkedHours.length;j++){
                                testUsers[j]=data1[i].usersWorkedHours[j].idUser;
                            }
                        }

                        Task.remove({
                            _id:{$in: tasksId}
                        })
                            .then(
                                User.updateMany(
                                    {_id: {$in: testUsers}}
                                    ,
                                    {
                                        $pull:{
                                            taskIds:{$in: tasksId}
                                        }
                                })
                                    .then(
                                    Client.find({})
                                        .exec(function (err, data) {
                                            if (err) {
                                                return res.status(500).json({
                                                    title: 'An error occurred',
                                                    error: err
                                                });
                                            }
                                            res.status(200).json(data);

                                        }))


                            )
                    })));


});

router.get('/one/:idProject', function(req, res, next) {

    Project.find({_id: req.params.idProject})
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

router.post('/update', function(req, res, next) {
    Project.updateOne({
            _id:req.body.idProject
        },
        {
            name:req.body.name,
            duration:req.body.duration,
            startDay:req.body.startDay,
            deadline:req.body.deadline,
            status:req.body.status

        })
        .then(function () {
            Project.find({})
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