var mysql2 = require('mysql2');
var bcrypt = require('bcryptjs');



const connection = mysql2.createConnection({
    host:'127.0.0.1',
    port:3306,
  user: "root",
  password: "newpassword",
  database :"social",
  multipleStatements: true
});

connection.connect((err)=>{
    if(err) throw err;
    else console.log('Connection Established');
});

// inserting user -----------------------------
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
                                callback(null,result.insertId);
                        })
                    } 
                });
        });
}



// Signing In user --------------------------------
    var checkUser=(body,callback)=>{
        connection.query("SELECT userid,userpassword from userinfo WHERE useremail='"+body.useremail+"'",(err,rows,fields)=>{
                if(rows.length==1) {
                //Comparing with bcrypts hash key --------
                    bcrypt.compare(body.password,rows[0].userpassword,(err,res)=>{
                            if(res)
                                callback(null,rows[0]);
                            else
                                callback(true,null);
                    })
                }
                else
                    callback(true,null);
                
        });
    }

// Getting user by id--------------------------------
    var getHome=(id,callback)=>{
        console.log(id);
        connection.query("SELECT * FROM post,foll_info WHERE follower_id=12 AND person1_id=uid1 order by time desc limit 3 ;SELECT * from userinfo WHERE userid= 2" ,[0,1],(err,result,fields)=>{
                if(result) 
                    callback(null,result);
                else
                    callback(err,null);
            }             
        );
    }


    var userresults = (userid,callback)=>{
        connection.query("SELECT * FROM post,foll_info WHERE follower_id=12 AND person1_id=uid1 order by time desc limit 2", function (err, result, fields) {
            if(result) 
                    callback(null,result);
            else
                    callback(err,null);
        }); 
        }

    

module.exports={
    insertUser,
    checkUser,
    getHome,
    userresults
}