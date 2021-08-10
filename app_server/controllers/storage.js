const mongoose = require('mongoose');
const Storage= mongoose.model('Storage');
const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { json } = require('express');


let getList = (req, res)=>{
    try {
        Storage.find({user:req.user._id},(err, docs) => {
            if(err){
                res.status(403).json(err);
            }else {
                res.status(200).json(docs)
            }
        })
    } catch {
        res.status(500).json();
    }
};

let download = async (req, res)=>{
    try{
        var filekey = req.params.filekey;
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const params = {
            Bucket: process.env.BUCKET_NAME_CONTENT,
            Key: filekey
        }
        var result = await s3.getObject(params).promise();
        res.status(200).send({data:Buffer.from(result.Body).toString('base64')});
    }catch(e){
        res.status(500);
    }
};

let addNew = async (req, res)=>{
    try{
        let typeList = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'image/jpeg',
                        'image/jpg',
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
                Bucket: process.env.BUCKET_NAME_CONTENT,
                Key: uniqueKey,
                ACL: 'public-read',
                Body: str
            }
            var result = await s3.upload(params).promise();
            Storage.create({
                title: req.files.file.name,
                file: result.Key,
                dataType: req.files.file.type,
                user: req.user._id,
                url: result.Location
            })
            res.status(200).send(result);
        }
    }catch(e){
        res.status(500).send(e);
    }
};

let remove= async (req, res)=>{
    try {
        var filekey = req.params.docid;
        
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const params = {
            Bucket: process.env.BUCKET_NAME_CONTENT,
            Key: filekey
        }
        var result = await s3.deleteObject(params).promise();
        Storage.findOne({file: filekey},function(err,docs){
            if(err){
                res.status(400),json(err);
            }else{
                Storage.findByIdAndRemove({_id: docs._id},(err) =>{
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




module.exports = {
    getList,
    download,
    addNew,
    remove
};