var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join(__dirname,'../model/queries'));
const mime = require('mime');
var multer = require('multer');

var storage = multer.diskStorage({
    destination:'./public/uploads',
    filename: (req,file,callback)=>{
        callback(null,Date.now()+file.originalname);
    }
});
var upload = multer({ storage: storage })



router.get('/',(req,res)=>{
   res.render('landing');
});

router.get('/signin',(req,res)=>{
     res.render('signin'); 
});

router.post('/signin',(req,res)=>{
    queries.checkUser(req,(err,user)=>{
        if(err) 
            res.render('signin',{
            error: err});
        else {
     console.log(req.user);
    console.log(req.isAuthenticated());
            res.redirect('/homepage');
        }
    });
});

router.get('/signup',(req,res)=>{
   res.render('signup');
});

router.post('/signup',(req,res)=>{
    queries.insertUser(req.body,(err,userid)=>{
        if(err) 
            res.render('signup',{
            error: err});
        else 
            res.redirect('/homepage');
    });
});


router.get('/logout', (req, res, next) => {
    req.logout()
    req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.redirect('/signin')
    })
})﻿

router.get('/homepage',authenticationMiddleware(),(req,res)=>{
    
    queries.getHome(req.session.passport.user,(err,result)=>{
        if(err)
            throw err;
        else
        {  
            res.render('homepage',{
                    result
            });
        }       
    });
});

router.get('/explore',authenticationMiddleware(),(req,res)=>{
queries.getPeople(req.session.passport.user,(err,result)=>{
        if(err) 
            console.log(err);
        else {
            res.render('explore',{result});
        }
    });
 });





router.post('/post',upload.single('photo1'),(req,res)=>{


const keyFilename="./fir-bb90d-firebase-adminsdk-qbtbz-67a3a49f44.json"; //replace this with api key file
const projectId = "fir-bb90d" //replace with your project id
const bucketName = `fir-bb90d.appspot.com`;
const {Storage} = require('@google-cloud/storage');
  
// Creates a client
const storage = new Storage({
  projectId: projectId,
  keyFilename :keyFilename
});

const bucket = storage.bucket(bucketName);

var id = req.file.filename;
const filePath = "public/uploads/"+req.file.filename;
const uploadTo = id;
const fileMime = mime.lookup(filePath);

var url;

bucket.upload(filePath,{
    destination:uploadTo,
    public:true,
    metadata: {contentType: fileMime,cacheControl: "public, max-age=300"}
}, function(err, file) {

    if(err)
    {
        console.log(err);
        return;
    }
    

    console.log("thats "+url);
});


function createPublicFileURL(storageName) {
     return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;

}

//here, we are uploading theinfo to posts .. so it can be retrieved when necessary
 queries.addPosts(createPublicFileURL(uploadTo),req,(err,result)=>{
        if(err)
            throw err;
        else
        {
            console.log("fine whatever");
        }
     });





});



router.get('/profile',authenticationMiddleware(),(req,res)=>{
      queries.getProfile(req.session.passport.user,(err,result)=>{
        if(err)
            throw err;
        else
        {
            console.log(result);
            res.render('profile',{
                    result
                    });
        }
     });
});

router.get('/op_profile',authenticationMiddleware(),(req,res)=>{


    const user1 = 4 ; 
    queries.getoprof(user1,(err,result)=>{
        if(err)
            throw err;
        else
        {
            console.log(result);
            res.render('op_profile',{
                    result
            });
    }
});
});


router.post('/follow',(req,res)=>{
    var follower = req.session.passport.user;
    var following = req.body.pid;
    console.log("dfgh"+following);
    queries.followPeople(following,(err,userid),follower=>{
        if(err) 
            console.log(err);
        else 
            res.redirect('/homepage/'+userid);
    });
});


router.get('/post',authenticationMiddleware(),(req,res)=>{
    var result = req.session.passport.user;
   res.render('post',{result});
});



// router.post('/post',(req,res)=>{

// console.log("nameeeeeeee"+req.body.photo1);
// filename(req,req.body.photo1,err)
// console.log("wasup"+req.body.caption);
//     queries.addPosts(req,(err,result)=>{
//         if(err)
//             throw err;
//         else
//         {
//             console.log(result);           
//     }
// });





function authenticationMiddleware () {  
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

router.post('/like',(req,res)=>{
    console.log(res.data.tittle);
});

module.exports=router;