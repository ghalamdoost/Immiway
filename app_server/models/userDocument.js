const mongoose = require('mongoose');

const UserDocumentSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    file:{
        type:String,
        required: true
    },
    dataType:{
        type:String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
}, {
    timestamps: true
  })

UserDocumentSchema.index({coords: '2dsphere'});
mongoose.model('UserDocument', UserDocumentSchema);