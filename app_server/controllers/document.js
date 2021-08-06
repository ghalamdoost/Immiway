const mongoose = require('mongoose');
const UserDocument = mongoose.model('UserDocument');
const DocumentNotification = require('./notification');
const {Role} = require('../models/user');
const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { json } = require('express');

let addNewUserDocument= async (req, res)=>{
    try{
        let typeList = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/jpeg',
                        'image/png',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
        
        if(!typeList.includes(req?.files?.file?.type)){
            res.status(500).send('Invalid dataType');
        }else{
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            });
            let str = fs.createReadStream(req?.files?.file?.path);
            let uniqueKey = uuidv4()+'_'+req?.files?.file?.name;
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: uniqueKey,
                Body: str
            }
            var result = await s3.upload(params).promise();
            UserDocument.create({
                title: req.files.file.name,
                file: result.Key,
                dataType: req.files.file.type,
                user: req.user._id,
            }).then(result=>{
                DocumentNotification.create(result._id,req.user._id)
            })            
            res.status(200).send(result);
        }
    }catch(e){
        res.status(500).send(e);
    }
}

let downloadUserDocument = async (req,res)=>{
    try{
        var filekey = req.params.filekey;
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filekey
        }
        var result = await s3.getObject(params).promise();
        res.status(200).send({data:Buffer.from(result.Body).toString('base64')});
    }catch(e){
        res.status(500);
    }
}


let removeUserDocument= async (req, res)=>{
    try {
        var filekey = req.params.docid;
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filekey
        }
        var result = await s3.deleteObject(params).promise();
        UserDocument.findOne({file: filekey},function(err,docs){
            if(err){
                res.status(400),json(err);
            }else{
                DocumentNotification.remove(docs._id);

                UserDocument.findByIdAndRemove({_id: docs._id},(err) =>{
                    if(err){
                        res.status(403),json(err);
                    }else{
                        res.status(200).json("Document has been Deleted.")

                    }
                })
            }
        })        
        
    } catch {
        res.status(500).json();
    }
}

// let updateUserDocument=(req, res)=>{
//     try {
//         UserDocument.findByIdAndUpdate(
//             {
//                 _id:req.body._id
//             },
//             {
//                 title:req.body.title,
//                 data:req.body.data,
//                 dataType:req.body.dataType
//             },
//             { runValidators: true }
//         ,(err, doc) => {
//             if(err){
//                 res.status(403).json(err);
//             }else{
//                 res.status(200).json("Entity Updated")                
//             }
//         })
//     } catch {
//         res.status(500).json();
//     }
// }

let getDocumentList=(req, res)=>{
   try {
        UserDocument.find({user:req.user._id},(err, docs) => {
            if(err){
                res.status(403).json(err);
            }else {
                res.status(200).json(docs)
            }
        })
    } catch {
        res.status(500).json();
    }
}

/* let getDocumentInfo=(req, res)=>{
    try {
        UserDocument.findById({_id:req.params.docId},(err, doc) => {
            if(err){
                res.status(403).json(err);
            }else {
                res.status(200).json(doc)
            }
        })
    } catch {
        res.status(500).json();
    }
} */



module.exports = {
    addNewUserDocument,
    removeUserDocument,
    // updateUserDocument,
    getDocumentList,
    downloadUserDocument
}