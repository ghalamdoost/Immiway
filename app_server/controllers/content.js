const mongoose = require('mongoose');
const Content= mongoose.model('Content');


let getContent = (req, res)=>{
    res.status(200).json("home Content")
};


//Todo: this method should be recursive to have unlimited subList, now it only has 3 hierarchy level
let getNavList = (req, res)=>{
    try {
        Content.find({isNav:true},(err, docs) => {
            if(err){
                res.status(403).json(err);
            }else {
                var nav=[],sub=[];
                docs.forEach(x=>{
                                      
                    if(x.parentId!=null){
                        sub.push({
                            _id:x._id.toHexString(),
                            primaryTitle:x.primaryTitle,
                            parentId:x.parentId.toHexString(),
                            priority:x.priority,
                            isNav:x.isNav,
                            subList:[],
                            imgURL:x.imgURL,
                            description:x.description,
                            showOnHomePage:x.showOnHomePage
                        })
                    }else{
                        nav.push({
                            _id:x._id.toHexString(),
                            primaryTitle:x.primaryTitle,
                            priority:x.priority,
                            isNav:x.isNav,
                            subList:[],
                            parentTitle:'',
                            imgURL:x.imgURL,
                            description:x.description,
                            showOnHomePage:x.showOnHomePage
                        })
                    }   
                })

                checkAndSort(nav, sub);

                res.status(200).json(nav)
            }
        })
    } catch {
        res.status(500).json();
    }
};

let getHomeNavList=(req, res)=>{
    try {
        Content.find({isNav:true},(err, docs) => {
            if(err){
                res.status(403).json(err);
            }else {
                var nav=[],sub=[];
                docs.forEach(x=>{
                                      
                    if(!x.showOnHomePage){
                        sub.push({
                            _id:x._id.toHexString(),
                            primaryTitle:x.primaryTitle,
                            parentId:x.parentId!=null ? x.parentId.toHexString() : 0,
                            priority:x.priority,
                            isNav:x.isNav,
                            subList:[],
                            imgURL:x.imgURL,
                            description:x.description,
                            showOnHomePage:x.showOnHomePage
                        })
                    }else{
                        nav.push({
                            _id:x._id.toHexString(),
                            primaryTitle:x.primaryTitle,
                            priority:x.priority,
                            isNav:x.isNav,
                            subList:[],
                            parentTitle:'',
                            imgURL:x.imgURL,
                            description:x.description,
                            showOnHomePage:x.showOnHomePage
                        })
                    }   
                })


                checkAndSort(nav, sub);

                res.status(200).json(nav)
            }
        })
    } catch {
        res.status(500).json();
    }
}

let checkAndSort= (nav, sub)=>{
    nav.forEach(item=>{
        var temp=sub.filter(x=>x.parentId==item._id)
        if(temp.length>0){
            temp.forEach(element => {
                item.subList.push(element);
                var index=sub.indexOf(element);
                sub.splice(index,1);
            });
        }
    })
    if(sub.length>0){
        nav.forEach(element => {
            if(element.subList.length>0){
                checkAndSort(element.subList, sub) 
            }            
        });        
    }
}


let addNewContent = (req, res)=>{
    try{
        Content.findOne({primaryTitle:req.body.primaryTitle},(err, result)=>{
            if(err){
                res.status(403).json(err.message);
            }else if(result){
                res.status(403).json("Names should be unique");
            }else{

                Content.create({
                    primaryTitle:req.body.primaryTitle.replace(/\s/g, '-'),
                    description:req.body.description,
                    parentId:req.body.parentId,
                    priority:req.body.priority,
                    isNav:req.body.isNav,
                    imgURL:req.body.imgURL,
                    description:req.body.description,
                    showOnHomePage:req.body.showOnHomePage
                }, (err,response) => {
                    if(err){
                        res.status(403).json(err.message);
                    }else{
                        res.status(201).json(response)
                    }
                })
            }
        })
        
    }catch{
        res.status(500).json();
    }
}


let removeContent=(req, res)=>{
    try {
        Content.find({parentId:req.params.contentid},(err, docs)=>{
            if(err){
                res.status(403).json(err);
            }else if(docs && docs.length>0) {
                res.status(403).send("You can't remove a parent content as long as there is a child atached to it");
            }else if(docs && docs.length==0){
                Content.findByIdAndRemove({_id:req.params.contentid}, (err) => {
                    if(err){
                        res.status(403).json(err);
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

let getContentList=(req,res)=>{
    try{
        if(req.params.parentid=='null'){
            Content.find({isNav:true},(err, docs) => {
                if(err){
                    res.status(403).json(err);
                }else {
                    var root=[];
                    docs.forEach(x=>{
                        if(x.parentId==null){
                            root.push({
                                _id:x._id.toHexString(),
                                primaryTitle:x.primaryTitle,
                                priority:x.priority,
                                isNav:x.isNav,
                                parentId:x.parentId,
                                parentTitle:"root",
                                imgURL:x.imgURL,
                                description:x.description,
                                showOnHomePage:x.showOnHomePage
                            })
                        }
                        
                    })
                    res.status(200).json(root)
                }
            })
        }else{
            Content.find({isNav:true, parentId:req.params.parentid},(err, docs) => {
                if(err){
                    res.status(403).json(err);
                }else {
                    Content.findById({_id:req.params.parentid}, (error, result)=>{
                        if(error){
                            res.status(403).json(error);
                        }else{
                            var root=[];
                            docs.forEach(x=>{
                                root.push({
                                    _id:x._id.toHexString(),
                                    primaryTitle:x.primaryTitle,
                                    priority:x.priority,
                                    isNav:x.isNav,
                                    parentId:x.parentId,
                                    parentTitle:result.primaryTitle,
                                    imgURL:x.imgURL,
                                    description:x.description,
                                    showOnHomePage:x.showOnHomePage
                                })
                            })
                            res.status(200).json(root)
                        }                        
                    })                    
                }
            })
        }
        
    }catch{
        res.status(500).json();
    }
}

let updateContent=(req, res)=>{
    try {
        Content.findByIdAndUpdate(
            {_id:req.body.contentid},
            {
                // primaryTitle:req.body.primaryTitle,
                priority:req.body.priority,
                description:req.body.description,
                parentId:req.body.parentId,
                imgURL:req.body.imgURL,
                description:req.body.description,
                showOnHomePage:req.body.showOnHomePage
            },
            { runValidators: true }
        , (err,result,r)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(result!=null){
                res.status(201).json({
                    _id:req.body.contentid,
                    primaryTitle:result.primaryTitle,
                    priority:req.body.priority,
                    description:req.body.description,
                    isNav:req.body.isNav,
                    parentId:req.body.parentId,
                    imgURL:req.body.imgURL,
                    description:req.body.description,
                    showOnHomePage:req.body.showOnHomePage
                })
            }else{
                res.status(403).json();
            }
        }) 
    }catch{
        res.status(500).json();
    }
}

let getPage=(req, res)=>{
    try {
        Content.findOne({parentId:req.params.parentid, isNav:false}, (err,content)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(content==null){
                res.status(200).json("add new content")
            }else{
                res.status(200).json(content)
            }
        })
    }catch{
        res.status(500).json();
    }
}

let getPageByName=(req, res)=>{
    try {
        Content.findOne({primaryTitle:req.params.pageTitle, isNav:true}, (err, content)=>{
            if(err){
                res.status(400).json(err.message);
            }else if(content){
                Content.findOne({parentId:content._id, isNav:false}, (error,ct)=>{
                    if(error){
                        res.status(400).json(err.message);
                    }else if(ct){
                        res.status(200).json(ct)
                    }else{
                        res.status(404).json("Not found");                        
                    }
                })                
            }else{
                res.status(404).json("Not found");
            }
        })        
    }catch{
        res.status(500).json();
    }
}

module.exports = {
    getContent,
    getNavList,
    getHomeNavList,
    addNewContent,
    removeContent,
    getContentList,
    updateContent,
    getPage,
    getPageByName
};