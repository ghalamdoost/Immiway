const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    primaryTitle:{
        type:String,
        required: true
    },
    description:{
        type:String,
        default : null
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Content',
        default : null
    },
    priority:{
        type:Number,        
        required: true,
        default : 0
    },
    isNav:{
        type:Boolean,
        required:true,
        default:false
    },
    imgURL:{
        type:String,
        default:null
    },
    showOnHomePage:{
        type:Boolean,
        required:true,
        default:false
    }
}, {
    timestamps: true
})

// ContentSchema.pre('save', function(next){
//     if(this.isNav){
//         this.description=null
//     }
//     next()
// })

ContentSchema.index({coords: '2dsphere'});
mongoose.model('Content', ContentSchema);