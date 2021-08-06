const mongoose = require('mongoose');

const StorageSchema = new mongoose.Schema({
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
    url:{
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

StorageSchema.index({coords: '2dsphere'});
mongoose.model('Storage', StorageSchema);