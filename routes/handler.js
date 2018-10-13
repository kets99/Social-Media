var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join(__dirname,'../model/queries'));
var sess;
const mime = require('mime');

router.get('/',(req,res)=>{
   res.render('landing');
});


router.get('/signin',(req,res)=>{
     res.render('signin'); 
});

router.post('/signin',(req,res)=>{
     console.log(req.user);
    console.log(req.isAuthenticated());

    queries.checkUser(req,(err,user)=>{
        if(err) 
            res.render('signin',{
            error: err});
        else {
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


router.get('/homepage',authenticationMiddleware(),(req,res)=>{
    
    queries.getHome(req.session.passport.user,(err,result)=>{
        if(err)
            throw err;
        else
        {
            
            console.log(result);
            res.render('homepage',{
                    result
            });
    }
});
});



router.get('/explore',(req,res)=>{
queries.getPeople(userid1,(err,result)=>{
        if(err) 
            console.log(err);
        else {
            res.render('explore',{result});

        }
    });
    
});



router.post('/follow',(req,res)=>{
    var follower = id;
    var following = req.body.userid;
    queries.followPeople(following,(err,userid),follower=>{
        if(err) 
            console.log(err);
        else 
            res.redirect('/homepage/'+userid);
    });
});


router.get('/photoposting',(req,res)=>{
   res.render('post');
});




router.post('/photoposting',(req,res)=>{
    var url ;
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

var id=55;
var img=id;

var vmvm = req.body.path1;
console.log(vmvm)
//put a ../ before the filename to get desktop

const filePath = 'bleh.jpg';
const uploadTo = id+'.jpg';
const fileMime = mime.lookup(filePath);


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
    console.log(createPublicFileURL(uploadTo));
});


function createPublicFileURL(storageName) {
     url =`http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;
return url ;
}

queries.addPosts(following,(err,userid),follower=>{
        if(err) 
            console.log(err);
        else 
            res.redirect('/homepage/'+userid);
    });




});







router.get('/profile',(req,res)=>{
   res.render('profile');
});




router.get('/post/add',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/html/post/post.html'));
    if(req.file) console.log(req.files);
});

router.post('/post/add',(req,res)=>{
    console.log(req.file);
    console.log(typeof(req.file));
    console.log(ketki1);
    
}
);



function authenticationMiddleware () {  
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}



module.exports=router;