var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join(__dirname,'../model/queries'));


router.get('/',(req,res)=>{
   res.render('landing');
});


router.get('/signin',(req,res)=>{
   res.render('signin'); 
});

router.post('/signin',(req,res)=>{
    queries.checkUser(req.body,(err,user)=>{
        if(err) 
            res.render('signin',{
            error: err});
        else {
            res.redirect('/homepage/'+user.userid);
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
            res.redirect('/homepage/'+userid);
    });
});


router.get('/homepage/:userid',(req,res)=>{
    queries.getHome(req.params.userid,(err,result)=>{
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

// router.get('/homepage/:userid',(req,res)=>{
//    queries.userresults(req.params.userid,(err,result)=>{
//         if(err) console.log(err)
//             else res.render('homepage',{result});
//    })
// });

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


module.exports=router;