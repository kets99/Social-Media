var mysql2 = require('mysql2');
var bcrypt = require('bcryptjs');
var passport1 = require('./../app');
var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');


const connection = mysql2.createConnection({
    host:'127.0.0.1',

  user: "root",
  password: "newpassword",
  database :"social",
  multipleStatements: true
});

connection.connect((err)=>{
    if(err) throw err;
    else console.log('Connection Established');
});


//nserting user -----------------------------
var insertUser=(body,callback)=>{
    //Encryption -------------------------------
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) 
                console.log(err);
            else 
                bcrypt.hash(body.password,salt,(err,hash)=>{
                    if(err) 
                        console.log('err',err);
                    else 
                    {
                        //insert to database ------------------------
                        connection.query("INSERT INTO USERINFO(USERNAME,USEREMAIL,USERDOB,USERPASSWORD) VALUES('"+body.username+"','"+body.email+"','"+body.dob+"','"+hash+"')",(err,result)=>{
                            if(err)
                                callback(err,null);
                            else
                            {

                                callback(null,result.insertId);
                        }
                        })
                    } 
                });
        });
}



// Signing In user --------------------------------
    var checkUser=(req,callback)=>{
        connection.query("SELECT userid,userpassword from userinfo WHERE useremail='"+req.body.useremail+"'",(err,rows,fields)=>{
                if(rows.length==1) {
                //Comparing with bcrypts hash key --------
                    bcrypt.compare(req.body.password,rows[0].userpassword,(err,res)=>{
                            if(res){
                                const userid = rows[0].userid;
                                req.login(userid,function(err){
                                    //res.redirect('/');
                                })
                               callback(null,rows[0]);
                            }

                            else

                                callback(true,null);
                    })
                }
                else
                    callback(true,null);
                
        });
    }


    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
                   done(null, id);

    });
         

// Getting user info and feed ---------------------------------
    var getHome=(id,callback)=>{
    
        connection.query("SELECT * FROM post,foll_info WHERE follower_id="+id+" AND person1_id=uid1 order by time desc limit 10 ;SELECT * from userinfo WHERE userid="+id ,[0,1],(err,result,fields)=>{
                if(result) 
                    callback(null,result);
                else
                    callback(err,null);
            }             
        );
    }




//getting users profile 
 var getProfile=(id,callback)=>{
        
        connection.query("SELECT * FROM post WHERE uid1="+id+" order by time desc limit 10 ;SELECT * from userinfo WHERE userid="+id ,[0,1],(err,result,fields)=>{
                if(result) 
                    callback(null,result);
                else
                    callback(err,null);
            }             
        );
    }

 var getPeople=(id,callback)=>{
        console.log("this"+id);
        //abhi , its not getting distinct values ..
        connection.query("SELECT * FROM userinfo,foll_info WHERE  follower_id NOT In ("+id+") AND userid=person1_id limit 20 ;SELECT * from userinfo WHERE userid= "+id ,[0,1],(err,result,fields)=>{
                if(result) 
                    callback(null,result);
                else
                    callback(err,null);
            }             
        );
    }


 var followPeople=(user1)=>{
    
        console.log("hereee");
        var follower = userid1;
        connection.query("insert into foll_info(follower_id,person1_id) values ("+follower+","+user1+")",(err,result,fields)=>{
                if(result) 
                    console.log("Followed");
                else
                    console.log("ERROR");
            }             
        );
    }
    


 var likeAdd=(pid)=>{
    
        console.log("hereee");
        var userid1 = req.session.passport.user;
        connection.query("insert into like_info(likerid,postid) values ("+userid1+","+pid+")",(err,result,fields)=>{
                if(result) 
                    console.log("Followed");
                else
                    console.log("ERROR");
            }             
        );
    }


 var commentAdd=(user2)=>{
    
        console.log("hereee");
        var follower = userid1;
        connection.query("insert into foll_info(follower_id,person1_id) values ("+follower+","+user1+")",(err,result,fields)=>{
                if(result) 
                    console.log("Followed");
                else
                    console.log("ERROR");
            }             
        );
    }



 var addPosts=(id,callback)=>{
        //the method for adding post details ... into the dtabase
        connection.query("insert into ",(err,result,fields)=>{
                if(result) 
                    callback(null,result);
                else
                    callback(err,null);
            }             
        );
    }

module.exports={
    insertUser,
    checkUser,
    getHome,
    getPeople,
    followPeople,
    addPosts,
    getProfile,
    likeAdd,
    commentAdd,
}

