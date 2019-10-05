var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var Client = require('../model/client.model');

/* POST sujets to DB. */
router.post('/ajout', function(req, res, next) {

    var myClient = new Client({
        name: req.body.name,
        description: req.body.description,
        projectsID: req.body.projectsID
    });


    myClient.save()
        .then(function () {
            Client.find({})
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
    Client.find({})
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

router.post('/one', function(req, res, next) { //this is used to add the project Id to the client

    Client.updateOne({
        name:req.body.clientName
        },
        {
            $push:{
                projectsID:req.body.idProject
            }
        })
        .then(function () {
            Client.find({})
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

router.get('/delete/:idClient', function(req, res, next) {

        Client.deleteOne({
            _id: req.params.idClient
        })
            .then(function () {
                Client.find({})
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


router.get('/getOne/:clientName', function(req, res, next) {

    console.log(req.params.clientName);

    Client.findOne({
        name:req.params.clientName
    }).exec(function(err, data) {
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

module.exports = router;