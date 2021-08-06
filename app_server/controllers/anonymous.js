

let home = (req, res)=>{
    res.status(200).json("home Content")
};

let aboutUs = (req, res)=>{
    res.status(200).json("aboutus Content")
};

let contactUs = (req, res)=>{
    res.status(200).json("contact Content")
};




module.exports = {
    home,
    aboutUs,
    contactUs
};